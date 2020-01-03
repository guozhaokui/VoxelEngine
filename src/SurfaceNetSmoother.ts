import { BoundBox } from "laya/d3/math/BoundBox";
import { VertexMesh } from "laya/d3/graphics/Vertex/VertexMesh";
import { Vector3 } from "laya/d3/math/Vector3";
import { Mesh } from "laya/d3/resource/models/Mesh";
import { PrimitiveMesh } from "laya/d3/resource/models/PrimitiveMesh";

/**
 * 取实心的地方为-1，空心的为1，则对于边界处的空格子，其中心的值为0，移动范围是 (-1,1)
 * 经过调整后，中心点发生了偏移,在边上的交点根据中心点的xyz进行调整就行
 * 
 * 问题:
 * 		单个节点的问题
 * 			如果一个平面上只有一个格子的坑，则会形成不合理的节点
 * 				  。
 *                |
 *          --。--。---。---
 * 				直接处理呢
 * 			两个格子的坑也会，需要>两个
 * 				  。---。
 *                |    |
 *          --。--。---。---
 * 
 * 			实心的突出一个格子能表达（对应3个外节点），凹陷不能
 */

const enum AdjNode {
	PX = 0,
	PY = 1,
	PZ = 2,
	NX = 3,
	NY = 4,
	NZ = 5
}

class SurfaceNetNode {
	voxID: int = 0;		// 最大允许1024**3。能反向得到xyz
	/** 调整后的位置 优化的时候可以用byte表示相对调整位置*/
	posx: number;
	posy: number;
	posz: number;
	/** 临时目标，因为不能一次处理，所以中间结果先保存在这里 */
	tmpx = 0;
	tmpy = 0;
	tmpz = 0;

	// 相邻信息
	adjinfo = 0; 		// 前6个bit，每个bit表示对应的相邻位是否有实心voxel。这些也为计算法线提供信息
	// 每次处理的时候会把自己加到对方，同时把对方加到自己。 用id是一个位置，比对象更容易维护.
	// 一次处理三个也是为了提高效率


	linkeNodeNum = 0; 	// 连接的节点数。上面只记录的下一个，连接的要把指向自己的也算上。每个最多有6个：两个角的顶角处
	// 以后放到 adjinfo 中

	value = 0;			// 缺省为0，调整后从-1到1之间变化
	//nextNodes:SurfaceNets[]=[];

	resetTarget() {
		this.tmpx = this.tmpy = this.tmpz = 0;
		this.value = 0;
	}

	step(k: number) {
		this.posx = this.posx + (this.tmpx - this.posx) * k;
		this.posy = this.posy + (this.tmpy - this.posy) * k;
		this.posz = this.posz + (this.tmpz - this.posz) * k;
		// TODO 约束到格子内
	}

	getDataID() {

	}

	adjbynode(n: SurfaceNetNode) {
		this.tmpx += n.posx;
		this.tmpy += n.posy;
		this.tmpz += n.posz;

		n.tmpx += this.posx;
		n.tmpy += this.posy;
		n.tmpz += this.posz;
	}
}

/**
 *    y
 *    |
 *    |_______x
 *   /
 *  /
 * z
 */
var neighborDir = [
	[-1, 1, 1], [-1, 1, 0], [-1, 1, -1], [0, 1, 1], [0, 1, 0], [0, 1, -1], [1, 1, 1], [1, 1, 0], [1, 1, -1],	// 最上层，沿着x切
	[-1, 0, 1], [-1, 0, 0], [-1, 0, -1], [0, 0, 1],/*[0,0,0],*/[0, 0, -1], [1, 0, 1], [1, 0, 0], [1, 0, -1],
	[-1, -1, 1], [-1, -1, 0], [-1, -1, -1], [0, -1, 1], [0, -1, 0], [0, -1, -1], [1, -1, 1], [1, -1, 0], [1, -1, -1],
];

let int1 = new Uint32Array(2);

export class SurfaceNetSmoother {
	private surfacenet: SurfaceNetNode[] = [];
	private dbgSurfaceNet: SurfaceNetNode[] = [];	//
	private dist = [0, 0, 0]
	relaxSpeed = 0.5;
	private data: Float32Array;
	private dims: number[];
	private maxx = 0;
	private maxy = 0;
	private maxz = 0;
	/** 26个相邻点的偏移。注意在边界的地方不允许使用 */
	private neighbors: number[] = [];

	//for debug
	private getData(x: int, y: int, z: int) {
		let d = this.data;
		let dist = this.dist;
		let dims = this.dims;
		if (x < 0 || y < 0 || z < 0 || x >= dims[0] || y >= dims[1] || z >= dims[2])
			debugger;
		return d[x + dist[1] * y + dist[2] * z]
	}
	private idtoxyz(id: int) {
		let dist = this.dist;
		let dims = this.dims;
		int1[0] = id / dims[0] % dims[2];	// z = id/xsize%zsize. x部分变成小数被丢掉，剩下的是 y*zsize+z
		int1[1] = id / dist[1];	// y = id/(xsize*zsize)
		return { x: id % dims[0], y: int1[1], z: int1[0] };
	}
	private printNb(idOrx: int, y: int, z: int) {
		let r = this.idtoxyz(idOrx);
		let p3 = y != undefined;
		let cx = p3 ? idOrx : r.x;
		let cy = p3 ? y : r.y;
		let cz = p3 ? z : r.z;
		console.log(`
  %d %d %d
 %d %d %d
%d %d %d

  %d %d %d
 %d %d %d
%d %d %d

  %d %d %d
 %d %d %d
%d %d %d
`,
			this.getData(cx - 1, cy + 1, cz - 1), this.getData(cx, cy + 1, cz - 1), this.getData(cx + 1, cy + 1, cz - 1),
			this.getData(cx - 1, cy + 1, cz), this.getData(cx, cy + 1, cz), this.getData(cx + 1, cy + 1, cz),
			this.getData(cx - 1, cy + 1, cz + 1), this.getData(cx, cy + 1, cz + 1), this.getData(cx + 1, cy + 1, cz + 1),

			this.getData(cx - 1, cy, cz - 1), this.getData(cx, cy, cz - 1), this.getData(cx + 1, cy, cz - 1),
			this.getData(cx - 1, cy, cz), this.getData(cx, cy, cz), this.getData(cx + 1, cy, cz),
			this.getData(cx - 1, cy, cz + 1), this.getData(cx, cy, cz + 1), this.getData(cx + 1, cy, cz + 1),

			this.getData(cx - 1, cy - 1, cz - 1), this.getData(cx, cy - 1, cz - 1), this.getData(cx + 1, cy - 1, cz - 1),
			this.getData(cx - 1, cy - 1, cz), this.getData(cx, cy - 1, cz), this.getData(cx + 1, cy - 1, cz),
			this.getData(cx - 1, cy - 1, cz + 1), this.getData(cx, cy - 1, cz + 1), this.getData(cx + 1, cy - 1, cz + 1),

		);
	}
	//for debug end

	private isBorder(id: int): boolean {
		let data = this.data;
		let nb = this.neighbors;
		//if( x==0 || y==0 || z==0 || x==dims[0]-1 || y==dims[1]-1 || z==dims[2]-1 )
		//	return true;

		// 注意现在假设空的地方为0。 注意不要位置浸染
		return data[id] <= 0 && (
			data[id + nb[0]] > 0 ||
			data[id + nb[1]] > 0 ||
			data[id + nb[2]] > 0 ||
			data[id + nb[3]] > 0 ||
			data[id + nb[4]] > 0 ||
			data[id + nb[5]] > 0 ||
			data[id + nb[6]] > 0 ||
			data[id + nb[7]] > 0 ||
			data[id + nb[8]] > 0 ||
			data[id + nb[9]] > 0 ||
			data[id + nb[10]] > 0 ||
			data[id + nb[11]] > 0 ||
			data[id + nb[12]] > 0 ||
			data[id + nb[13]] > 0 ||
			data[id + nb[14]] > 0 ||
			data[id + nb[15]] > 0 ||
			data[id + nb[16]] > 0 ||
			data[id + nb[17]] > 0 ||
			data[id + nb[18]] > 0 ||
			data[id + nb[19]] > 0 ||
			data[id + nb[20]] > 0 ||
			data[id + nb[21]] > 0 ||
			data[id + nb[22]] > 0 ||
			data[id + nb[23]] > 0 ||
			data[id + nb[24]] > 0 ||
			data[id + nb[25]] > 0);
	}

	/**
	 * 创建表面节点网，这个网上的点是距离值为0的点
	 * 不允许出现粗细为1的形状，会被忽略
	 * 数据格式先假设为 y 向上
	 * @param data 值只能是0或者1
	 */
	createSurfaceNet(data: Float32Array, dims: number[]) {
		this.data = data;
		this.dims = dims;
		let xn = dims[0];
		let yn = dims[1];
		let zn = dims[2];

		let dx = 1;
		let dy = xn * zn;
		let dz = xn;

		let dist = this.dist;
		dist[0] = dx;
		dist[1] = dy;
		dist[2] = dz;

		let neighbors = this.neighbors;
		neighbors.length = 26;
		for (let i = 0; i < 26; i++) {
			let ndir = neighborDir[i];
			neighbors[i] = ndir[0] + ndir[1] * dy + ndir[2] * dz;
		}

		let nets = this.surfacenet;

		let maxx = xn - 1;
		let maxy = yn - 1;
		let maxz = zn - 1;

		console.time('findborder');
		let nodenum = 0;
		// 找出所有的边界。为了简单，先不考虑最外一圈
		let nid = 0;
		for (let y = 1; y < maxy; y++) {
			for (let z = 1; z < maxz; z++) {
				nid = y * dy + z * dz;
				nid += 1;
				for (let x = 1; x < maxx; x++) {
					if (this.isBorder(nid)) {
						let n = new SurfaceNetNode();
						n.voxID = nid;
						n.posx = x;
						n.posy = y;
						n.posz = z;
						nets[nid] = n;
						nodenum++;
					}
					nid++;
				}
			}
		}
		console.log('nodenum=', nodenum);
		console.timeEnd('findborder');

		// 看所有的节点是否有相邻点。 没有的会被消掉（只能消除单个点，所以可能还有多个独立部分）
		// TODO 这个合到上面应该会更快
		let netNodes: SurfaceNetNode[] = [];
		for (let cn of nets) {
			//TODO
			if (cn == undefined)
				continue;
			let id = cn.voxID;

			let nexid = id + 1;
			let nexn = nets[nexid];
			if (nexn) {
				cn.adjinfo |= 1;
				cn.linkeNodeNum++;
				nexn.linkeNodeNum++;
				nexn.adjinfo |= (1 << AdjNode.NX);
			}
			nexid = id + dy;
			nexn = nets[nexid];
			if (nexn) {	// 注意如果是边缘的话这个会出错
				cn.adjinfo |= (1 << AdjNode.PY);
				cn.linkeNodeNum++;
				nexn.linkeNodeNum++;
				nexn.adjinfo |= (1 << AdjNode.NY);
			}
			nexid = id + dz;
			nexn = nets[nexid];
			if (nexn) {
				cn.adjinfo |= (1 << AdjNode.PZ);
				cn.linkeNodeNum++;
				nexn.linkeNodeNum++;
				nexn.adjinfo |= (1 << AdjNode.NZ);
			}
			if (cn.linkeNodeNum > 0) {
				netNodes[id] = cn;
				this.dbgSurfaceNet.push(cn);
			}
		}
		nets = this.surfacenet = netNodes;
	}

	/**
	 * 只更新局部
	 * 问题：单向记录数据不便于更新数据（扩充一个边查找也可以）
	 * @param aabb 
	 */
	public updateRegin(aabb: BoundBox) {
		// 扩大一下范围
	}

	/**
	 * 放松网络
	 * @param it  次数
	 */
	public relaxSurfaceNet(it: number) {
		let data = this.data;
		let net = this.surfacenet;
		let k = this.relaxSpeed;
		let n = net.length;
		let dist = this.dist;
		let distx = dist[0];
		let disty = dist[1];
		let distz = dist[2];
		let xflag = 1 << AdjNode.PX;
		let yflag = 1 << AdjNode.PY;
		let zflag = 1 << AdjNode.PZ;

		for (let i = 0; i < it; i++) {
			// 清零
			for (let ni = 0; ni < n; ni++) {
				let cn = net[ni];
				cn && cn.resetTarget();
			}
			// 互相影响
			for (let cn of net) {
				if (!cn) continue;
				let cid = cn.voxID;
				let adjinfo = cn.adjinfo;
				if (adjinfo & xflag) {
					let nxn = net[cid + distx];	// TODO 注意这里可能会绕到错误的地方
					cn.adjbynode(nxn);
				}
				if (adjinfo & yflag) {
					let nyn = net[cid + disty];
					cn.adjbynode(nyn);
				}
				if (adjinfo & zflag) {
					let nzn = net[cid + distz];
					cn.adjbynode(nzn);
				}
			}

			// 朝目标移动。
			for (let i = 0; i < n; i++) {
				let cn = net[i];
				if (!cn) continue;
				let ln = cn.linkeNodeNum;	// 这里除是为了效率
				cn.tmpx /= ln;
				cn.tmpy /= ln;
				cn.tmpz /= ln;
				cn.step(k);
			}
		}

		// 应用到原来的数据上
		for (let i = 0; i < n; i++) {
			let cn = net[i];
			if (!cn) continue;

			//data[cn.voxID] = Math.random();//cn.value;
		}
	}

	toMeshes() {
		let vertex: number[] = [];
		let index: number[] = [];
		let vn = 0;
		let totalvn = 0;
		var vertDecl = VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
		let d1 = new Vector3();
		let d2 = new Vector3();
		let norm = new Vector3();
		let ret: Mesh[] = [];

		let nets = this.dbgSurfaceNet;
		let n = nets.length;
		for (let i = 0; i < n; i++) {
			let cn = nets[i];
			switch (cn.linkeNodeNum) {
				case 3:
					break;
				case 4: {
					let v0: number[];
					let v1: number[];
					let v2: number[];
					let v3: number[];
					// 临时计算一个错误的法线
					d1.x = v2[0] - v1[0];
					d1.y = v2[1] - v1[1];
					d1.z = v2[2] - v1[2];
					d2.x = v3[0] - v1[0];
					d2.y = v3[1] - v1[1];
					d2.z = v3[2] - v1[2];
					Vector3.cross(d2, d1, norm);
					vertex.push(v1[0], v1[1], v1[2], norm.x, norm.y, norm.z, 0, 0);
					vertex.push(v2[0], v2[1], v2[2], norm.x, norm.y, norm.z, 0, 0);
					vertex.push(v3[0], v3[1], v3[2], norm.x, norm.y, norm.z, 0, 0);

					vertex.push(cv[0], cv[1], cv[2], norm.x, norm.y, norm.z, 0, 0)

					vn += vnum;
					totalvn += vnum;
					if (vn > 60 * 1024) {
						vn = 0;
						let vert = new Float32Array(vertex);
						let idx = new Uint16Array(index);
						ret.push((PrimitiveMesh as any)._createMesh(vertDecl, vert, idx) as Mesh);
						vertex.length = 0;
						index.length = 0;
					}
				}
					break;
				case 5:
					break;
				case 6:
					break;
			}
		}

		if (index.length > 0) {
			let vert = new Float32Array(vertex);
			let idx = new Uint16Array(index);
			ret.push((PrimitiveMesh as any)._createMesh(vertDecl, vert, idx) as Mesh);
		}
		return ret;
	}
}

