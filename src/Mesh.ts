import { Vector3 } from "laya/d3/math/Vector3";
import { VertexMesh } from "laya/d3/graphics/Vertex/VertexMesh";
import { Mesh } from "laya/d3/resource/models/Mesh";
import { PrimitiveMesh } from "laya/d3/resource/models/PrimitiveMesh";

interface volumeDesc{
	get:(x:number,y:number,z:number)=>number;	
}

export function GreedyMesh(volume:volumeDesc|number[], dims: number[]) {
	performance.mark('greedystart');
	function _get(i: i32, j: i32, k: i32){
		return (volume as number[])[i + dims[0] * (j + dims[1] * k)];
	}
	let get=(volume as any).get || _get;
	//Sweep over 3-axes
	var quads = [];
	for (var d = 0; d < 3; ++d) {
		var i, j, k, l, w, h
			, u = (d + 1) % 3	//x d=0,u=1,v=2   y:d=1,u=2,v=0  z:d=2,u=0,v=1
			, v = (d + 2) % 3
			, x = [0, 0, 0]
			, q = [0, 0, 0];

		let ds = dims[d];
		let vs = dims[v];
		let us = dims[u];

		let normal=[0,0,0];
		normal[d]=-1;

		/** 大小为当前扫描平面的分辨率 */
		let mask = new Int32Array(us*vs);
			
		q[d] = 1;

		for (x[d] = -1; x[d] < ds;) {
			//normal[d]*=-1;
			//Compute mask
			var n = 0;
			for (x[v] = 0; x[v] < vs; ++x[v]){
				for (x[u] = 0; x[u] < us; ++x[u]) {
					// 在有效范围内取 0<= <dims[]-1
					// 在当前轴上，前进一步，看是不是一样
					// get(x0,x1,x2)!=get(x0+axis.x, x1+axis.y, x2+axis.z)
					let pre = 0 <= x[d] ? get(x[0], x[1], x[2]) : false;
					let cur = x[d] < ds - 1 ? get(x[0] + q[0], x[1] + q[1], x[2] + q[2]) : false;
					let v = (pre!=cur)?1:0;
					if(v && pre) v|=2;	//表示对面，用来区分法线
					mask[n++] = v;
				}
			}
			//Increment x[d]
			++x[d];
			//Generate mesh for mask using lexicographic ordering
			// 根据mask生成mesh。
			n = 0;
			for (j = 0; j < vs; ++j){
				for (i = 0; i < us;) {
					let cmask=mask[n];
					if (cmask) {
						// 每次扫过一个连续的w和尽可能大的h来添加
						//Compute width
						//查找mask，看有多少连续的，=>w 
						for (w = 1; mask[n + w]==cmask && i + w < us; ++w) {}
						//Compute height (this is slightly awkward
						//计算h
						var done = false;
						for (h = 1; j + h < vs; ++h) {
							for (k = 0; k < w; ++k) {
								if (mask[n + k + h * us]!=cmask) {
									done = true;
									break;
								}
							}
							if (done) {
								break;
							}
						}
						//Add quad
						x[u] = i; x[v] = j;
						var du = [0, 0, 0]; du[u] = w;
						var dv = [0, 0, 0]; dv[v] = h;
						let x0=x[0],x1=x[1],x2=x[2];
						let du0=du[0],du1=du[1],du2=du[2];
						let dv0=dv[0],dv1=dv[1],dv2=dv[2];
						let back = cmask&2;
						let nx=normal[0];
						let ny=normal[1];
						let nz=normal[2];
						quads.push([
							new Vector3(x0, x1, x2)
							, new Vector3(x0 + du0, x1 + du1, x2 + du2)
							, new Vector3(x0 + du0 + dv0, x1 + du1 + dv1, x2 + du2 + dv2)
							, new Vector3(x0 + dv0, x1 + dv1, x2 + dv2)
							, new Vector3(back?-nx:nx,back?-ny:ny,back?-nz:nz)
						]);

						// 已经分配过的mask要删掉，防止被再用
						for (l = 0; l < h; ++l)
							for (k = 0; k < w; ++k) {
								mask[n + k + l * us] = 0;
							}
						//Increment counters and continue
						i += w; n += w;
					} else {
						//mask为0，表示不是当前方向的边界,
						++i;//i 的 for循环继续
						++n;//下一个mask
					}
				}
			}
		}
	}
	performance.mark('greedyend');
	performance.measure('greedytime', 'greedystart', 'greedyend');
	console.log( 'greedy time:',performance.getEntriesByName('greedytime')[0].duration, '四边形：',quads.length)
	return quads;
}


/**
 * 遍历xn,yn,zn取到vox数据，然后合并成四边形
 * @param data vox数据，只要能提供一个get(x,y,z):bool的函数就行
 * @param xn  vox数据的x大小，
 * @param yn  vox数据的y大小
 * @param zn  vox数据的z大小
 * @param min 外部提供的包围盒
 * @param max 
 */
export function createVoxMesh(data: volumeDesc, xn: i32, yn: i32, zn: i32, rx:int, ry:int, rz:int, min: Vector3, max: Vector3): Mesh {
	var vertDecl = VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
	let quad = GreedyMesh(data, [rx, ry, rz]);
	let vertex: number[] = [];
	let index: number[] = [];

	let sx = max.x - min.x;
	let sy = max.y - min.y;
	let sz = max.z - min.z;
	let ux = sx / xn;//x的单位
	let uy = sy / yn;
	let uz = sz / zn;
	let vn = 0;
	quad.forEach(v => {
		let v0 = v[0];
		let v1 = v[1];
		let v2 = v[2];
		let v3 = v[3];
		let n1 = v[4];
		v0.x
		vertex.push(
			v0.x * ux + min.x, v0.y * uy + min.y, v0.z * uz + min.z, n1.x, n1.y, n1.z, 0, 0,
			v1.x * ux + min.x, v1.y * uy + min.y, v1.z * uz + min.z, n1.x, n1.y, n1.z, 1, 0,
			v2.x * ux + min.x, v2.y * uy + min.y, v2.z * uz + min.z, n1.x, n1.y, n1.z, 1, 1,
			v3.x * ux + min.x, v3.y * uy + min.y, v3.z * uz + min.z, n1.x, n1.y, n1.z, 1, 0);
		index.push(vn + 0, vn + 1, vn + 3, vn + 1, vn + 2, vn + 3);
		vn += 4;
	});

	let vert = new Float32Array(vertex);
	let idx = new Uint16Array(index);
	return (PrimitiveMesh as any)._createMesh(vertDecl, vert, idx)
}

export function creatQuadMesh(vertexPos:number[][], quads:number[][]){
	let vertex: number[] = [];
	let index: number[] = [];
	let vn = 0;
	let totalvn=0;
	var vertDecl = VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
	let d1 = new Vector3();
	let d2 = new Vector3();
	let norm = new Vector3();
	let ret:Mesh[]=[];
	quads.forEach( (quad:number[])=>{
		let isQuad = quad.length==4;
		let vnum=3;
		isQuad && (vnum=4);
		let v1 = vertexPos[quad[0]];
		let v2 = vertexPos[quad[1]];
		let v3 = vertexPos[quad[2]];

		// 临时计算一个错误的法线
		d1.x =v2[0]-v1[0];
		d1.y =v2[1]-v1[1];
		d1.z=v2[2]-v1[2];
		d2.x=v3[0]-v1[0];
		d2.y=v3[1]-v1[1];
		d2.z=v3[2]-v1[2];
		Vector3.cross(d2,d1,norm);
		vertex.push(v1[0], v1[1], v1[2], norm.x,norm.y,norm.z, 0, 0);
		vertex.push(v2[0], v2[1], v2[2], norm.x,norm.y,norm.z, 0, 0);
		vertex.push(v3[0], v3[1], v3[2], norm.x,norm.y,norm.z, 0, 0);
		if(isQuad){
			let v4 = vertexPos[quad[3]];
			vertex.push(v4[0], v4[1], v4[2], norm.x,norm.y,norm.z, 0, 0);
		}

		if(isQuad){
			index.push(vn + 0, vn + 2, vn + 1, vn , vn + 3, vn + 2);
		}else{
			index.push(vn + 0, vn + 2, vn + 1);
		}

		vn+=vnum;
		totalvn+=vnum;

		if(vn>60*1024){
			vn=0;
			let vert = new Float32Array(vertex);
			let idx = new Uint16Array(index);
			ret.push( (PrimitiveMesh as any)._createMesh(vertDecl, vert, idx) as Mesh);	
			vertex.length=0;
			index.length=0;
		}
	});

	if(index.length>0){
		let vert = new Float32Array(vertex);
		let idx = new Uint16Array(index);
		ret.push( (PrimitiveMesh as any)._createMesh(vertDecl, vert, idx) as Mesh);	
	}

	console.log('vertexnum=',totalvn);
	return ret;
}