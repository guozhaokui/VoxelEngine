import { Vector3 } from "laya/d3/math/Vector3";

class SymetricMatrix {
	m: number[];

	constructor() {
		this.m = new Array(10).fill(0);
	}

	set(m11: number, m12: number, m13: number, m14: number,
		m22: number, m23: number, m24: number,
		m33: number, m34: number,
		m44: number): SymetricMatrix {
		this.m[0] = m11;
		this.m[1] = m12;
		this.m[2] = m13;
		this.m[3] = m14;

		this.m[4] = m22;
		this.m[5] = m23;
		this.m[6] = m24;

		this.m[7] = m33;
		this.m[8] = m34;

		this.m[9] = m44;
		return this;
	}
	makePlane(a: number, b: number, c: number, d: number): SymetricMatrix {
		return this.set(
			a * a, a * b, a * c, a * d,
			b * b, b * c, b * d,
			c * c, c * d,
			d * d
		);
	}

	det(a11: int, a12: int, a13: int,
		a21: int, a22: int, a23: int,
		a31: int, a32: int, a33: int): number {
			let m = this.m;
		var det = 
		      m[a11] * m[a22] * m[a33]
			+ m[a13] * m[a21] * m[a32]
			+ m[a12] * m[a23] * m[a31]
			- m[a13] * m[a22] * m[a31]
			- m[a11] * m[a23] * m[a32]
			- m[a12] * m[a21] * m[a33];
		return det;
	}

	add(n: SymetricMatrix): SymetricMatrix {
		let m = this.m;
		let nm = n.m;
		return new SymetricMatrix().set(
			m[0] + nm[0],
			m[1] + nm[1],
			m[2] + nm[2],
			m[3] + nm[3],

			m[4] + nm[4],
			m[5] + nm[5],
			m[6] + nm[6],

			m[7] + nm[7],
			m[8] + nm[8],

			m[9] + nm[9]
		);
	}

	addSelf(n: SymetricMatrix): void {
		let m=this.m;
		let nm = n.m;
		m[0] += nm[0]; m[1] += nm[1]; m[2] += nm[2]; m[3] += nm[3];
		m[4] += nm[4]; m[5] += nm[5]; m[6] += nm[6]; m[7] += nm[7];
		m[8] += nm[8]; m[9] += nm[9];
	}

}

class Triangle {
	/** 三个顶点的索引 */
	v = [0, 0, 0];
	/** 三个顶点的误差，最后一个表示三个点中的最小误差 */
	err = [0, 0, 0, 0];
	deleted = false;
	dirty = false;
	/** 平面的法线 */
	n = new Vector3();	
	candel = true;
}

class Vertex {
	p = new Vector3();
	normal = new Vector3();
	color = new Vector3();
	/** 开始的Ref，指向 Ref的下标 */
	tstart = -1;
	/** 共享此顶点的面的个数 */
	tcount = -1;
	/** 当前的误差矩阵（与周围几个面） */
	q = new SymetricMatrix();
	/** 当前点是边界点 */
	border = false;
	candel = true;
}

// TODO 改成数组
class Ref {
	/** 三角形索引 */
	tid = -1;
	/** 三角形中的第几个顶点 */
	tvertex = -1;
}

export class SimplifyMesh {

	/** 当前保留的三角形 */
	triangles: Triangle[] = [];
	vertices: Vertex[] = [];
	/** 数量是三角形个数x3 */
	refs: Ref[] = [];

	// 最大误差限制
	Error_MAX: number = 500000;
	Mesh_error: number = 0;

	init(vb: Float32Array, ib: Uint16Array): void {

		for (var j: int = 0, m = vb.length; j < m; j += 10) {
			var vert = new Vertex();
			vert.p.x = vb[j];
			vert.p.y = vb[j + 1];
			vert.p.z = vb[j + 2];
			vert.color.setValue(vb[j + 6], vb[j + 7], vb[j + 8]);
			this.vertices.push(vert);
		}

		var color0, color1, color2;
		for (var i: int = 0, n = ib.length; i < n; i += 3) {
			var tri = new Triangle();
			tri.v[0] = ib[i];
			tri.v[1] = ib[i + 1];
			tri.v[2] = ib[i + 2];
			this.triangles.push(tri);

			color0 = this.vertices[tri.v[0]].color;
			color1 = this.vertices[tri.v[1]].color;
			color2 = this.vertices[tri.v[2]].color;

			if (!(Vector3.equals(color0, color1) && Vector3.equals(color1, color2))) {
				this.vertices[tri.v[0]].candel = false;
				this.vertices[tri.v[1]].candel = false;
				this.vertices[tri.v[2]].candel = false;

				tri.candel = false;
			}
		}
	}

	//
	// Main simplification function
	//
	// target_count  : target nr. of triangles
	// agressiveness : sharpness to increase the threshold.
	//                 5..8 are good numbers
	//                 more iterations yield higher quality
	//
	simplify_mesh(target_count: int, agressiveness: int = 7): void {
		let Mesh_error = this.Mesh_error;
		let Error_MAX = this.Error_MAX;
		var i: int, il: int;
		let triangles = this.triangles;
		for (i = 0, il = triangles.length; i < il; i++) {
			triangles[i].deleted = false;
		}

		var deleted_triangles: int = 0;
		// v0所属的三角形哪个受到了删除边的影响，也是被删除的三角形
		var deleted0: boolean[] = [];	
		var deleted1: boolean[] = []; // std::vector<int>
		var triangle_count: int = triangles.length;

		for (var iteration = 0; iteration < 100; iteration++) {
			if (triangle_count - deleted_triangles <= target_count) break;
			if (Mesh_error > Error_MAX) break;

			// update mesh once in a while
			if (iteration % 5 === 0) {
				this.update_mesh(iteration);
			}
			// clear dirty flag
			for (var j: int = 0; j < triangles.length; j++) {
				triangles[j].dirty = false;
			}

			//
			// All triangles with edges below the threshold will be removed
			//
			// The following numbers works well for most models.
			// If it does not, try to adjust the 3 parameters
			//
			var threshold = 0.000000001 * Math.pow(iteration + 3, agressiveness);
			// remove vertices & mark deleted triangles
			for (i = 0, il = triangles.length; i < il; i++) {
				var tri = triangles[i];
				if (tri.err[3] > threshold || tri.deleted || tri.dirty || !tri.candel) continue;

				// 检查每个点的误差
				for (j = 0; j < 3; j++) {
					if (tri.err[j] < threshold) {
						// 如果边 j 的误差满足条件
						var i0 = tri.v[j];
						var v0 = this.vertices[i0];

						var i1: int = tri.v[(j + 1) % 3];
						var v1 = this.vertices[i1];

						var i2: int = tri.v[(j + 2) % 3];
						var v2 = this.vertices[i2];

						// color check
						if (!(v0.candel && v1.candel && v2.candel)) continue;

						// Border check
						if (v0.border != v1.border) continue;

						// Compute vertex to collapse to
						var p: Vector3 = new Vector3();
						// 计算i0,i1合并后的新位置p
						this.calculate_error(i0, i1, p);

						deleted0.length = v0.tcount;
						deleted1.length = v1.tcount;
						//this.resize(deleted0, v0.tcount); // normals temporarily
						//this.resize(deleted1, v1.tcount); // normals temporarily

						// dont remove if flipped
						// 如果生成的点 p 会导致i0所属的平面翻转则不删除。 同时给 delete0,1赋值
						if (this.flipped(p, i0, i1, v0, v1, deleted0)) continue;
						if (this.flipped(p, i1, i0, v1, v0, deleted1)) continue;

						// 更新v0的位置和误差
						v0.p = p;
						v0.q.addSelf(v1.q);

						var tstart = this.refs.length;

						// CONTINUE

						deleted_triangles = this.update_triangles(i0, v0, deleted0, deleted_triangles);
						deleted_triangles = this.update_triangles(i0, v1, deleted1, deleted_triangles);

						var tcount = this.refs.length - tstart;

						if (tcount <= v0.tcount) {
							// 如果有删掉的三角形
							if (tcount){
								// refs的 tstart开始的tcount个，移动到v0.tstart开始的地方
								this.move(this.refs, v0.tstart, tstart, tcount);
								this.resize(this.refs,tstart);
							}
						}
						else
							// append
							v0.tstart = tstart;
						v0.tcount = tcount;
						break;
					}
				}// end for j
				// done?
				if (triangle_count - deleted_triangles <= target_count)
					break;
			}
		} // end iteration

		// clean up mesh
		this.compact_mesh();
	}

	resize<T>(array: T[], count: int) {
		if (count < array.length) {
			return array.splice(count);
		}
		return null;
	}

	n: Vector3 = new Vector3();
	d1: Vector3 = new Vector3();
	d2: Vector3 = new Vector3();

	/**
	 * 新的点p 对v0所在的所有三角形来说，会不会导致法线翻转
	 * 下面三个三角形，上面有个横边ab,a移动到b，穿越了cd边，会导致三角形1翻转
	 * a---------b
	 * \   3    /
	 *  \ 1 d 2/
	 *   \  | /
	 *    \  /
	 *      V
	 *      c
	 * 对i0,v0来说，删掉 i1,v1 点
	 * @param p 
	 * @param i0 
	 * @param i1 	要合并的点
	 * @param v0 
	 * @param v1 
	 * @param deleted 
	 */
	flipped(p: Vector3, i0: int, i1: int, v0: Vertex, v1: Vertex, deleted: boolean[]): boolean {
		let d1 = this.d1;
		let d2 = this.d2;
		let n = this.n;
		let refs = this.refs;
		let vertices = this.vertices;
		let triangles = this.triangles;

		let v0tstart = v0.tstart;
		for (var k: int = 0; k < v0.tcount; k++) {
			// 对v0所属的所有三角形
			var tri = triangles[refs[v0tstart + k].tid];
			if (tri.deleted) continue;

			var s = refs[v0tstart + k].tvertex;
			var id1 = tri.v[(s + 1) % 3];
			var id2 = tri.v[(s + 2) % 3];

			if (id1 == i1 || id2 == i1) // delete ?
			{	// 这个三角形的某条边塌陷了，所以这个三角形也就消失了 
				// bordercount++;
				deleted[k] = true;
				continue;
			}

			Vector3.subtract(vertices[id1].p, p, d1);
			Vector3.normalize(d1, d1);
			Vector3.subtract(vertices[id2].p, p, d2);
			Vector3.normalize(d2, d2);

			if (Math.abs(Vector3.dot(d1, d2)) > 0.999) return true;	// 两条边几乎共线
			Vector3.cross(d1, d2, n);
			Vector3.normalize(n, n);
			deleted[k] = false;
			if (Vector3.dot(n, tri.n) < 0.2) return true;	// 法线翻转了
		}
		return false;
	}

	update_mesh(iteration: int) {
		let triangles = this.triangles;
		let vertices = this.vertices;
		let refs = this.refs;
		this.Mesh_error = 0;

		// 清理triangles列表，保留没有删除的
		if (iteration > 0) {
			var dst: int = 0;
			for (var i: int = 0; i < triangles.length; i++) {
				var target: Triangle = triangles[i];
				if (!target.deleted) {
					triangles[dst++] = target;
					this.Mesh_error += target.err[3];
				}
			}
			//console.log("update_mesh Mesh_error: ", this.Mesh_error)
			//            triangles.splice( dst );
			triangles.length=dst;
		}

		if (iteration === 0) {
			//            for (var i: int = 0; i < vertices.length; i++ ) {
			//                // may not need to do this.
			//                vertices[i].q = new SymetricMatrix();
			//            }
			console.time('init1')
			let p1p0 = new Vector3();
			let p2p0 = new Vector3();
			for (let i: int = 0; i < triangles.length; i++) {
				// 计算每个点的误差矩阵
				var t = triangles[i];

				let p0 = vertices[t.v[0]].p;
				let p1 = vertices[t.v[1]].p;
				let p2 = vertices[t.v[2]].p;

				Vector3.subtract(p1, p0, p1p0);
				Vector3.subtract(p2, p0, p2p0);

				let n = t.n;// new Vector3();
				Vector3.cross(p1p0, p2p0, n);
				Vector3.normalize(n, n);
				//t.n = n;

				var tmp = new SymetricMatrix().makePlane(n.x, n.y, n.z, -Vector3.dot(n, p0));
				for (var j: int = 0; j < 3; j++) {
					vertices[t.v[j]].q.addSelf(tmp);
				}
			}

			console.timeEnd('init1');

			var pp = new Vector3();
			for (let i: int = 0; i < triangles.length; i++) {
				// Calc Edge Error
				var t = triangles[i];
				// 计算三个边分别对应的合并后的误差
				t.err[0] = this.calculate_error(t.v[0],t.v[1],pp);
				t.err[1] = this.calculate_error(t.v[1],t.v[2],pp);
				t.err[2] = this.calculate_error(t.v[2],t.v[0],pp);
				t.err[3] = Math.min(t.err[0], t.err[1], t.err[2]);
			}
		}

		// Init Reference ID list
		for (var i: int = 0; i < vertices.length; i++) {
			vertices[i].tstart = 0;
			vertices[i].tcount = 0;
		}

		// 更新每个点的 tcount（被几个三角形共享，对体素数据大部分是6）
		for (var i: int = 0; i < triangles.length; i++) {
			var t = triangles[i];
			vertices[t.v[0]].tcount++;
			vertices[t.v[1]].tcount++;
			vertices[t.v[2]].tcount++;
		}

		var tstart = 0;
		// 更新 每个点的 tstart
		for (var i: int = 0; i < vertices.length; i++) {
			var v = vertices[i];
			v.tstart = tstart;
			tstart += v.tcount;
			v.tcount = 0;
		}
		// Write References
		refs=[];
		for (var i: int = 0; i < triangles.length * 3; i++) {
			refs[i] = new Ref();
		}
		// 给 ref 赋值
		for (var i: int = 0; i < triangles.length; i++) {
			var t = triangles[i];
			for (var j: int = 0; j < 3; j++) {
				var v = vertices[t.v[j]];
				let ref = refs[v.tstart+v.tcount];
				ref.tid = i;
				ref.tvertex = j;
				v.tcount++;
			}
		}

		// Identify boundary : vertices[].border=0,1
		// 找出边界点
		if (iteration == 0) {
			//            for (var i: int = 0; i < vertices.length; i++) {
			//                vertices[i].border = 0;
			//            }

			let vcount:number[] = [];
			let vids: number[] = [];
			for (var i: int = 0; i < vertices.length; i++) {
				var v = vertices[i];
				vcount.length=0;
				vids.length=0;
				for (var j = 0; j < v.tcount; j++) {
					let tri = triangles[refs[v.tstart + j].tid];
					for (var k: int = 0; k < 3; k++) {
						let ofs: int = 0
						let id: number = tri.v[k];
						while (ofs < vcount.length) {
							if (vids[ofs] == id) break;
							ofs++;
						}
						if (ofs == vcount.length) {
							vcount.push(1);
							vids.push(id);
						}
						else {
							vcount[ofs]++;
						}
					}
				}
				for (var j: int = 0; j < vcount.length; j++) {
					if (vcount[j] == 1) {
						vertices[vids[j]].border = true;
					}
				}
			}
		}
	}

	/**
	 * 计算 id_v1 和 id_v2 合并产生的顶点 p_result 以及产生的误差
	 * @param id_v1 
	 * @param id_v2 
	 * @param p_result 
	 */
	calculate_error(id_v1: int, id_v2: int, p_result: Vector3): number {
		let vertices = this.vertices;
		var vertex1 = vertices[id_v1];
		var vertex2 = vertices[id_v2];

		var q: SymetricMatrix = vertex1.q.add(vertex2.q);
		var border = vertex1.border && vertex2.border;
		var error = 0;
		var det = q.det(0, 1, 2, 1, 4, 5, 2, 5, 7);
		if (det !== 0 && !border) {
			// 行列式不为0，则可解
			p_result.x = -1 / det * (q.det(1, 2, 3, 4, 5, 6, 5, 7, 8));	// vx = A41/det(q_delta)
			p_result.y = 1 / det * (q.det(0, 2, 3, 1, 5, 6, 2, 7, 8));	// vy = A42/det(q_delta)
			p_result.z = -1 / det * (q.det(0, 1, 3, 1, 4, 6, 2, 5, 8));	// vz = A43/det(q_delta)
			error = this.vertex_error(q, p_result.x, p_result.y, p_result.z);
		}
		else {
			// 否则不可解，直接取中点
			var p1 = vertex1.p;
			var p2 = vertex2.p;
			var p3 = new Vector3();
			Vector3.add(p1, p2, p3);
			Vector3.scale(p3, 0.5, p3);
			var error1: number = this.vertex_error(q, p1.x, p1.y, p1.z);
			var error2: number = this.vertex_error(q, p2.x, p2.y, p2.z);
			var error3: number = this.vertex_error(q, p3.x, p3.y, p3.z);
			error = Math.min(error1, error2, error3);
			if (error1 === error) {
				p1.cloneTo(p_result);
			}
			if (error2 === error) {
				p2.cloneTo(p_result);
			}
			if (error3 === error) {
				p3.cloneTo(p_result);
			}
		}
		return error;
	}

	/**
	 * 更新v所属于的三角形们
	 * 
	 * @param i0 
	 * @param v 	
	 * @param deleted 
	 * @param deleted_triangles 当前已经删除的三角形个数
	 */
	update_triangles(i0: int, v: Vertex, deleted: boolean[], deleted_triangles: int): int {
		let refs = this.refs;
		let triangles = this.triangles;
		var p = new Vector3();

		// for v所属于的每个三角形
		for (var k = 0; k < v.tcount; k++) {
			var ref = refs[v.tstart + k];
			var tri = triangles[ref.tid];
			if (tri.deleted) continue;
			if (deleted[k]) {
				// 如果这个三角形要被删掉，则不更新了
				tri.deleted = true;
				deleted_triangles++;
				continue;
			}
			// 没有删掉，则要修改误差
			tri.v[ref.tvertex] = i0;
			tri.dirty = true;

			tri.err[0] = this.calculate_error(tri.v[0], tri.v[1], p);
			tri.err[1] = this.calculate_error(tri.v[1], tri.v[2], p);
			tri.err[2] = this.calculate_error(tri.v[2], tri.v[0], p);
			tri.err[3] = Math.min(tri.err[0], tri.err[1], tri.err[2]);
			// ？ref 是一直增加么，这个需要克隆么
			refs.push(ref);
		}
		return deleted_triangles;
	}

	/**
	 * 
	 */
	compact_mesh(): void {
		let vertices = this.vertices;
		let triangles = this.triangles;
		var dst: int = 0;
		for (var i = 0; i < vertices.length; i++) {
			vertices[i].tcount = 0;
		}
		for (var i = 0; i < triangles.length; i++) {
			if (!triangles[i].deleted) {
				var t: Triangle = triangles[i];
				triangles[dst++] = t;
				for (var j = 0; j < 3; j++)
					vertices[t.v[j]].tcount = 1;
			}
		}
		this.resize(triangles, dst);
		dst = 0;
		for (var i = 0; i < vertices.length; i++) {
			if (vertices[i].tcount) {
				vertices[i].tstart = dst;
				vertices[dst].p = vertices[i].p;
				vertices[dst].color = vertices[i].color;
				vertices[dst].candel = vertices[i].candel;
				dst++;
			}
		}
		for (var i = 0; i < triangles.length; i++) {
			var t: Triangle = triangles[i];
			for (var j = 0; j < 3; j++)
				t.v[j] = vertices[t.v[j]].tstart;
		}
		this.resize(vertices, dst);
	}

	/**
	 * 计算顶点{x,y,z}针对q产生的误差
	 * @param q 
	 * @param x 
	 * @param y 
	 * @param z 
	 */
	vertex_error(q: SymetricMatrix, x: number, y: number, z: number): number {
		let m = q.m;
		return m[0] * x * x + 2 * m[1] * x * y + 2 * m[2] * x * z + 2 * m[3] * x + m[4] * y * y + 2 * m[5] * y * z + 
				2 * m[6] * y + m[7] * z * z + 2 * m[8] * z + m[9];
	}

	/**
	 * 
	 * @param refs 
	 * @param dest 
	 * @param source 
	 * @param count 
	 */
	move<T>(refs: T[], dest: int, source: int, count: int): void {
		for (var i: int = 0; i < count; i++) {
			refs[dest + i] = refs[source + i];
		}
	}

	calThinNormal(): void {
		let triangles = this.triangles;
		let vertices = this.vertices;
		for (var i: int = 0; i < triangles.length; i++) {
			var t: Triangle = triangles[i];
			for (var j: int = 0; j < 3; j++) {
				var v: Vertex = vertices[t.v[j]];
				Vector3.add(v.normal, t.n, v.normal);
				Vector3.normalize(v.normal, v.normal);
			}
		}
	}

	calNormal(): void {
		var p1p0: Vector3 = new Vector3();
		var p2p0: Vector3 = new Vector3();
		let triangles = this.triangles;
		let vertices = this.vertices;

		for (var i: int = 0; i < triangles.length; i++) {
			var t: Triangle = this.triangles[i];
			var p0: Vector3 = vertices[t.v[0]].p;
			var p1: Vector3 = vertices[t.v[1]].p;
			var p2: Vector3 = vertices[t.v[2]].p;

			Vector3.subtract(p1, p0, p1p0);
			Vector3.subtract(p2, p0, p2p0);

			Vector3.cross(p1p0, p2p0, t.n);
			Vector3.normalize(t.n, t.n);
		}
	}

	private buildVertexBuffer(vertexBuffer: Float32Array, pos: int, t: Triangle): int {
		let vertices = this.vertices;
		for (var i: int = 0; i < 3; i++) {
			var v: Vertex = vertices[t.v[i]];
			vertexBuffer[pos++] = v.p.x;
			vertexBuffer[pos++] = v.p.y;
			vertexBuffer[pos++] = v.p.z;

			//                vertexBuffer[pos++] = -v.normal.x;
			//                vertexBuffer[pos++] = -v.normal.y;
			//                vertexBuffer[pos++] = -v.normal.z;

			vertexBuffer[pos++] = -t.n.x;
			vertexBuffer[pos++] = -t.n.y;
			vertexBuffer[pos++] = -t.n.z;

			vertexBuffer[pos++] = v.color.x;
			vertexBuffer[pos++] = v.color.y;
			vertexBuffer[pos++] = v.color.z;
			vertexBuffer[pos++] = 1.0;
		}
		return pos;
	}

	genMesh() {
		let triangles = this.triangles;
		this.calNormal();
		var indexLength: int = triangles.length;
		var indexBuffer: Uint16Array = new Uint16Array(indexLength * 3);
		var t: Triangle;

		var vertexBuffer: Float32Array = new Float32Array(indexLength * 3 * 10);
		var pos: int = 0;
		for (var i: int = 0; i < triangles.length; i++) {
			t = triangles[i];
			indexBuffer[3 * i + 0] = 3 * i + 0;
			indexBuffer[3 * i + 1] = 3 * i + 1;
			indexBuffer[3 * i + 2] = 3 * i + 2;

			pos = this.buildVertexBuffer(vertexBuffer, pos, t);
		}

		console.log("Mesh_error: ", this.Mesh_error);
		console.log("index length: ", indexBuffer.length);

		//return PrimitiveMesh._createMesh(vertexDeclaration, vertexBuffer, indexBuffer);
		var obj = { vb: vertexBuffer, ib: indexBuffer };
		this.triangles = [];
		this.vertices = [];
		this.refs = [];
		this.Mesh_error = 0;
		return obj;
	}

	genThinMesh(): Object {
		let triangles = this.triangles;
		let vertices = this.vertices;
		this.calNormal();
		this.calThinNormal();
		var indexmap = [];
		var triCount: int = triangles.length;
		var ib: Uint16Array = new Uint16Array(triCount * 3);
		var vbpos: int = 0;
		var vba = [];
		for (var i: int = 0; i < triCount; i++) {
			var t: Triangle = triangles[i];
			for (var j: int = 0; j < 3; j++) {
				var verindex: int = t.v[j];
				if (!indexmap[verindex]) {
					ib[i * 3 + j] = vbpos;
					indexmap[verindex] = vbpos++;
					vba.push(vertices[verindex]);
				}
				else {
					ib[3 * i + j] = indexmap[verindex];
				}
			}
		}

		var vb: Float32Array = new Float32Array(vba.length * 10);
		for (var i: int = 0; i < vba.length; i++) {
			var v: Vertex = vba[i];
			vb[i * 10 + 0] = v.p.x;
			vb[i * 10 + 1] = v.p.y;
			vb[i * 10 + 2] = v.p.z;

			vb[i * 10 + 3] = -v.normal.x;
			vb[i * 10 + 4] = -v.normal.y;
			vb[i * 10 + 5] = -v.normal.z;

			vb[i * 10 + 6] = v.color.x;
			vb[i * 10 + 7] = v.color.y;
			vb[i * 10 + 8] = v.color.z;
			vb[i * 10 + 9] = 1.0;
		}

		var obj = [];
		obj[0] = vb;
		obj[1] = ib;
		triangles = [];
		vertices = [];
		this.refs = [];
		return obj;
	}

	write_obj(){
		let vertices = this.vertices;
		let triangles = this.triangles;
		let ret = '';
		vertices.forEach( (v)=>{
			ret+=`v ${v.p.x} ${v.p.y} ${v.p.z}
`;
		});
		triangles.forEach( (t)=>{
			if(t.deleted) return;
			ret += `f ${t.v[0]}// ${t.v[1]}// ${t.v[2]}//
`
		});
		return ret;
	}	
}
