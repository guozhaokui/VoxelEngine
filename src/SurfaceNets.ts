// The MIT License (MIT)
//
// Copyright (c) 2012-2013 Mikola Lysenko
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * SurfaceNets in JavaScript
 *
 * Written by Mikola Lysenko (C) 2012
 *
 * MIT License
 *
 * Based on: S.F. Gibson, "Constrained Elastic Surface Nets". (1998) MERL Tech Report.
 */

 
//Internal buffer, this may get resized at run time
/** 能同时保存两层数据的buffer。大小都扩展了1 ,用来找顶点索引，偶数层在0层，上是1，奇数层在1层，上是0*/
var buffer = new Int32Array(4096);

/**
 * Z
 *    6 ------7
 *   /:      /|
 *  / :     / |
 * 4 ------5  |
 * |  2 ---|--3
 * |  /    | /
 * | /     |/
 * 0 ------1
 * 
 */

export class SurfaceNets {
	/** cube的12条边，每个占用2个所以24 */
	cube_edges = new Int32Array(24);
	/** 不同组合下的边表，一共2^8=256种 */
	edge_table = new Int32Array(256);
	constructor() {
		let cube_edges = this.cube_edges;
		let edge_table = this.edge_table;

		//Initialize the cube_edges table
		// This is just the vertex number of each cube
		let k = 0;
		for (let i = 0; i < 8; i++) {
			for (let j = 1; j <= 4; j <<= 1) {	// 1,2,4
				let p = i ^ j;
				if (i <= p) {
					this.cube_edges[k++] = i;
					this.cube_edges[k++] = p;
				}
			}
		}

		//Initialize the intersection table.
		//  This is a 2^(cube configuration) ->  2^(edge configuration) map
		//  There is one entry for each possible cube configuration, and the output is a 12-bit vector enumerating all edges crossing the 0-level.
		// 8个节点的不同组合对应哪条边上会有交点
		for (var i = 0; i < 256; ++i) {
			var em = 0;
			for (var j = 0; j < 24; j += 2) {
				var a = !!(i & (1 << cube_edges[j]))
					, b = !!(i & (1 << cube_edges[j + 1]));
				em |= a !== b ? (1 << (j >> 1)) : 0;
			}
			edge_table[i] = em;
		}
	}

	tomesh(data: Float32Array, dims: number[]) {
		let xl = dims[0];
		let yl = dims[1];
		let zl = dims[2];
		let cube_edges = this.cube_edges;
		let edge_table = this.edge_table;

		var vertices = []
			, faces = []
			, n = 0;

		var x = new Int32Array(3);

		/** 某个方向的相邻点的数组距离,+1是因为是下一个。+1可能是因为buffer是扩大了1的 TODO 改成y向上*/
		var adjDist = new Int32Array([1, (xl + 1), (xl + 1) * (yl + 1)]);

		/** 8个相邻格子的值 */
		var grid = new Float32Array(8);
		/** 偶数层还是奇数层？ */
		var buf_no = 1;

		//Resize buffer if necessary 
		if (adjDist[2] * 2 > buffer.length) {
			buffer = new Int32Array(adjDist[2] * 2);
		}

		//March over the voxel grid
		// foreach z
		for (x[2] = 0; x[2] < zl - 1; ++x[2], n += xl, buf_no ^= 1, adjDist[2] = -adjDist[2]) {

			//m is the pointer into the buffer we are going to use.  
			//This is slightly obtuse because javascript does not have good support for packed data structures, so we must use typed arrays :(
			//The contents of the buffer will be the indices of the vertices on the previous x/y slice of the volume
			var m = 1 + (xl + 1) * (1 + buf_no * (yl + 1));
			// foreach y
			for (x[1] = 0; x[1] < yl - 1; ++x[1], ++n, m += 2)
				// foreach x
				for (x[0] = 0; x[0] < xl - 1; ++x[0], ++n, ++m) {

					//Read in 8 field values around this vertex and store them in an array
					//Also calculate 8-bit mask, like in marching cubes, so we can speed up sign checks later
					// 每个格子找周围8个值记录下来，同时生成当前格子的mask值，mask记录哪个bit在内部
					/** 8个顶点在内部的就设置1 */
					var mask = 0;
					let g = 0, idx = n;
					for (var k = 0; k < 2; ++k, idx += xl * (yl - 2))
						for (var j = 0; j < 2; ++j, idx += xl - 2)
							for (var i = 0; i < 2; ++i, ++g, ++idx) {
								var p = data[idx];
								grid[g] = p;
								mask |= (p < 0) ? (1 << g) : 0;
							}

					//Check for early termination if cell does not intersect boundary
					// 全在内，全在外都停止
					if (mask === 0 || mask === 0xff) {
						continue;
					}

					//Sum up edge intersections
					/** 哪条边有交点 */
					var edge_mask = edge_table[mask];
					/** 顶点 */
					let  vert = [0.0, 0.0, 0.0];
					/** 有交点的边的个数 */
					let  e_count = 0;

					//For every edge of the cube...
					for (var i = 0; i < 12; ++i) {

						//Use edge mask to check if it is crossed
						if (!(edge_mask & (1 << i))) {
							// 如果当前边没有交点
							continue;
						}

						//If it did, increment number of edge crossings
						++e_count;

						//Now find the point of intersection
						//e0,e1是边对应的顶点索引
						var e0 = cube_edges[i << 1]       //Unpack vertices
							, e1 = cube_edges[(i << 1) + 1];
						//g0,g1是两个点的值
						let  g0 = grid[e0]                 //Unpack grid values
							, g1 = grid[e1];
						let t = g0 - g1;                 //Compute point of intersection
						if (Math.abs(t) > 1e-6) {
							t = g0 / t;	//t是交点的位置 t = -g0/(g1-g0) = g0/(g0-g1) = g0/t;
						} else {
							continue;
						}

						//Interpolate vertices and add up intersections (this can be done without multiplying)
						// 这里是假设距离都是1
						for (var j = 0, k = 1; j < 3; ++j, k <<= 1) {
							var a = e0 & k
								, b = e1 & k;
							if (a !== b) {
								vert[j] += a ? 1.0 - t : t;
							} else {
								vert[j] += a ? 1.0 : 0;
							}
						}
					}

					//Now we just average the edge intersections and add them to coordinate
					// 当前的xyz+所有的交点的中心值，就是想要的顶点
					var s = 1.0 / e_count;
					let dx = s*vert[0];
					let dy = s*vert[1];
					let dz = s*vert[2];
					/*
					dx = ((dx*32)|0)/32;
					dy = ((dy*32)|0)/32;
					dz = ((dz*32)|0)/32;
					*/
					vert[0] = x[0]+dx;
					vert[1] = x[1]+dy;
					vert[2] = x[2]+dz;

					//Add vertex to buffer, store pointer to vertex index in buffer
					buffer[m] = vertices.length;
					//console.log('buff[m]',m,vertices.length,x)
					vertices.push(vert);

					//Now we need to add faces together, to do this we just loop over 3 basis components
					for (var i = 0; i < 3; ++i) {
						//yz平面，xz平面，xy平面
						//The first three entries of the edge_mask count the crossings along the edge
						if (!(edge_mask & (1 << i))) {
							// 如果当前方向边没有交点，则不必处理
							continue;
						}

						// i = axes we are point along.  iu, iv = orthogonal axes
						var iu = (i + 1) % 3
							, iv = (i + 2) % 3;

						//If we are on a boundary, skip it
						// 在边界上（为什么没有考虑i的边界）
						/**
						 * i=x轴
						 * iu=y轴
						 * iv=z轴
						 * if(y==0 || z==0) continue;
						 * 因为要取y-1的，所以不能是0
						 * 
						 * i=y轴
						 * iu=z轴
						 * iv=x轴
						 * if(z==0||x==0) cotinue
						 * 
						 * 
						 */
						if (x[iu] === 0 || x[iv] === 0) {
							continue;
						}

						//Otherwise, look up adjacent edges in buffer
						var du = adjDist[iu]
							, dv = adjDist[iv];

						//Remember to flip orientation depending on the sign of the corner.
						// 连接相邻四个点。
						if (mask & 1) {
							// 如果当前cube在内部
							faces.push([buffer[m], buffer[m - dv], buffer[m - du - dv], buffer[m - du]]);
						} else {
							faces.push([buffer[m], buffer[m - du], buffer[m - du - dv], buffer[m - dv]]);
						}
					}
				}
		}
		//All done!  Return the result
		return { vertices: vertices, faces: faces };
	}
}



