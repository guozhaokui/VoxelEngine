import { BoundBox } from "laya/d3/math/BoundBox";
import { VertexMesh } from "laya/d3/graphics/Vertex/VertexMesh";
import { Vector3 } from "laya/d3/math/Vector3";
import { Mesh } from "laya/d3/resource/models/Mesh";
import { PrimitiveMesh } from "laya/d3/resource/models/PrimitiveMesh";
import { Camera } from "laya/d3/core/Camera";
import { Ray } from "laya/d3/math/Ray";
import { Vector2 } from "laya/d3/math/Vector2";

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
 * 
 * 注意：
 * 	边界在外面，对应空心的
 */

/**
 *           py   nz
 *           2   5
 *           |  /
 *           | /
 *    3------+------1 px
 *          /|
 *         / |
 *        0  4
 *      pz   ny
 * 
 * 这个是兼容老的layame的顺序
 */

const enum AdjNode {
	PX = 1,
	PY = 2,
	PZ = 0,
	NX = 3,
	NY = 4,
	NZ = 5,
	NN = 6
}

const enum FACEIDSTARTPOS{
	v=13		//6+7
}
const enum FaceID{
	PXPY=1<<FACEIDSTARTPOS.v,	// px,py
	PYNX=2<<FACEIDSTARTPOS.v,	// py,nx
	NXNY=4<<FACEIDSTARTPOS.v,	
	NYPX=8<<FACEIDSTARTPOS.v,

	PZPX=16<<FACEIDSTARTPOS.v,
	PXNZ=32<<FACEIDSTARTPOS.v,
	NZNX=64<<FACEIDSTARTPOS.v,
	NXPZ=128<<FACEIDSTARTPOS.v,

	PZPY=256<<FACEIDSTARTPOS.v,
	PYNZ=512<<FACEIDSTARTPOS.v,
	NZNY=1024<<FACEIDSTARTPOS.v,
	NYPZ=2048<<FACEIDSTARTPOS.v,
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

var neighborFlag = [
	0, 0, 0, 0, 1 << AdjNode.PY, 0, 0, 0, 0,
	0, 1 << AdjNode.NX, 0, 1 << AdjNode.PZ,/*0,*/1 << AdjNode.NZ, 0, 1 << AdjNode.PX, 0,
	0, 0, 0, 0, 1 << AdjNode.NY, 0, 0, 0, 0
];


const InvDir = [];
InvDir[AdjNode.PX] = AdjNode.NX;
InvDir[AdjNode.PY] = AdjNode.NY;
InvDir[AdjNode.PZ] = AdjNode.NZ;
InvDir[AdjNode.NX] = AdjNode.PX;
InvDir[AdjNode.NY] = AdjNode.PY;
InvDir[AdjNode.NZ] = AdjNode.PZ;


export class SurfaceNetNode {
	voxID: int = 0;		// 最大允许1024**3。能反向得到xyz
	vertexID:int=0;		// 三角形化用到
	/** 调整后的位置 优化的时候可以用byte表示相对调整位置*/
	posx: number;
	posy: number;
	posz: number;
	/** 临时目标，因为不能一次处理，所以中间结果先保存在这里 */
	tmpx = 0;
	tmpy = 0;
	tmpz = 0;

	// 相邻信息
	linkInfo = 0; 		// 前6个bit，每个bit表示对应的相邻位是否有表面节点。
	// 中间7个表示某个方向有数据，用来提供法线信息。第7个仅表示其他方向（斜着的），因为不关心斜着的方向，但是又要用来判断边界。
	// 高12个bit表示哪个方向已经建立三角形了，避免重复创建。每个平面四个

	// 每次处理的时候会把自己加到对方，同时把对方加到自己。 用id是一个位置，比对象更容易维护.
	// 一次处理三个也是为了提高效率


	linkeNodeNum = 0; 	// 连接的节点数。上面只记录的下一个，连接的要把指向自己的也算上。每个最多有6个：两个角的顶角处
	// 以后放到 adjinfo 中

	//nextNodes:SurfaceNets[]=[];

	resetTarget() {
		this.tmpx = this.tmpy = this.tmpz = 0;
		this.linkInfo&=~0b1111111111110000000000000;
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

	get linkInfoStr() {
		return ((this.linkInfo & (1 << AdjNode.PX)) ? 'PX ' : '') +
			((this.linkInfo & (1 << AdjNode.PY)) ? 'PY ' : '') +
			((this.linkInfo & (1 << AdjNode.PZ)) ? 'PZ ' : '') +
			((this.linkInfo & (1 << AdjNode.NX)) ? 'NX ' : '') +
			((this.linkInfo & (1 << AdjNode.NY)) ? 'NY ' : '') +
			((this.linkInfo & (1 << AdjNode.NZ)) ? 'NZ ' : '');
	}
}

function raysele() {

}

let int1 = new Uint32Array(2);

export class SurfaceNetSmoother {
	private static d1 = new Vector3();
	private static d2 = new Vector3();

	private surfacenet: SurfaceNetNode[] = [];
	private dbgSurfaceNet: SurfaceNetNode[] = [];	//
	private dist = [0, 0, 0]
	relaxSpeed = 0.99;
	private data: Float32Array;
	private dims: number[];
	private maxx = 0;
	private maxy = 0;
	private maxz = 0;
	/** 26个相邻点的偏移。注意在边界的地方不允许使用 */
	private neighbors: number[] = [];

	//for debug
	private camRay: Ray = new Ray(new Vector3(), new Vector3());
	private mousePt = new Vector2();

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

	// 临时，没有优化
	private selectNode(camera: Camera, mx: number, my: number, dist: number): SurfaceNetSmoother | null {
		let ray = this.camRay;
		let mouse = this.mousePt;
		mouse.x = mx;
		mouse.y = my;
		camera.viewportPointToRay(mouse, ray);
		let rayst = ray.origin;
		let raydir = ray.direction;

		let nets = this.dbgSurfaceNet;
		let nn = nets.length;
		for (let ni = 0; ni < nn; ni++) {
			let cn = nets[ni];
			cn.posx;
		}

		return null;
	}
	//for debug end

	private getAdjInfo(id: int) {
		let data = this.data;
		let nb = this.neighbors;
		let ret = 0;
		let dist = this.dist;
		let distx = dist[0];
		let disty = dist[1];
		let distz = dist[2];
		if (data[id + distx] > 0)	//TODO 注意会位置溢出
			ret |= (1 << AdjNode.PX);
		if (data[id - distx] > 0)
			ret |= (1 << AdjNode.NX);
		if (data[id + disty] > 0)
			ret |= (1 << AdjNode.PY);
		if (data[id - disty] > 0)
			ret |= (1 << AdjNode.NY);
		if (data[id + distz] > 0)
			ret |= (1 << AdjNode.PZ);
		if (data[id - distz] > 0)
			ret |= (1 << AdjNode.NZ);
		return ret;
	}

	// 返回实心的位置信息
	private isBorder(id: int): number {
		let data = this.data;
		let nb = this.neighbors;
		//if( x==0 || y==0 || z==0 || x==dims[0]-1 || y==dims[1]-1 || z==dims[2]-1 )
		//	return true;

		// 注意现在假设空的地方为0。 注意不要位置浸染
		// 兼容 0空 1实   -1空 1实
		/*
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
			*/
		// 不考虑斜着的数据
		if (data[id] > 0) return 0;
		let ret = 0;
		data[id + nb[0]] > 0 && (ret |= neighborFlag[0]);
		data[id + nb[1]] > 0 && (ret |= neighborFlag[1]);
		data[id + nb[2]] > 0 && (ret |= neighborFlag[2]);
		data[id + nb[3]] > 0 && (ret |= neighborFlag[3]);
		data[id + nb[4]] > 0 && (ret |= neighborFlag[4]);
		data[id + nb[5]] > 0 && (ret |= neighborFlag[5]);
		data[id + nb[6]] > 0 && (ret |= neighborFlag[6]);
		data[id + nb[7]] > 0 && (ret |= neighborFlag[7]);
		data[id + nb[8]] > 0 && (ret |= neighborFlag[8]);
		data[id + nb[9]] > 0 && (ret |= neighborFlag[9]);
		data[id + nb[10]] > 0 && (ret |= neighborFlag[10]);
		data[id + nb[11]] > 0 && (ret |= neighborFlag[11]);
		data[id + nb[12]] > 0 && (ret |= neighborFlag[12]);
		data[id + nb[13]] > 0 && (ret |= neighborFlag[13]);
		data[id + nb[14]] > 0 && (ret |= neighborFlag[14]);
		data[id + nb[15]] > 0 && (ret |= neighborFlag[15]);
		data[id + nb[16]] > 0 && (ret |= neighborFlag[16]);
		data[id + nb[17]] > 0 && (ret |= neighborFlag[17]);
		data[id + nb[18]] > 0 && (ret |= neighborFlag[18]);
		data[id + nb[19]] > 0 && (ret |= neighborFlag[19]);
		data[id + nb[20]] > 0 && (ret |= neighborFlag[20]);
		data[id + nb[21]] > 0 && (ret |= neighborFlag[21]);
		data[id + nb[22]] > 0 && (ret |= neighborFlag[22]);
		data[id + nb[23]] > 0 && (ret |= neighborFlag[23]);
		data[id + nb[24]] > 0 && (ret |= neighborFlag[24]);
		data[id + nb[25]] > 0 && (ret |= neighborFlag[25]);
		return ret;
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
			if (neighborFlag[i] == 0) neighborFlag[i] = 1 << AdjNode.NN;	// 只是表示有
			neighborFlag[i] = neighborFlag[i] << 6;
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
					let nf = this.isBorder(nid);
					if (nf != 0) {
						let n = new SurfaceNetNode();
						n.voxID = nid;
						n.posx = x;
						n.posy = y;
						n.posz = z;
						n.linkInfo |= nf;
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
				cn.linkInfo |= (1 << AdjNode.PX);
				cn.linkeNodeNum++;
				nexn.linkeNodeNum++;
				nexn.linkInfo |= (1 << AdjNode.NX);
			}
			nexid = id + dy;
			nexn = nets[nexid];
			if (nexn) {	// 注意如果是边缘的话这个会出错
				cn.linkInfo |= (1 << AdjNode.PY);
				cn.linkeNodeNum++;
				nexn.linkeNodeNum++;
				nexn.linkInfo |= (1 << AdjNode.NY);
			}
			nexid = id + dz;
			nexn = nets[nexid];
			if (nexn) {
				cn.linkInfo |= (1 << AdjNode.PZ);
				cn.linkeNodeNum++;
				nexn.linkeNodeNum++;
				nexn.linkInfo |= (1 << AdjNode.NZ);
			}
			if (cn.linkeNodeNum > 0) {
				netNodes[id] = cn;
				this.getAdjInfo(cn.voxID);
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
		console.time('relaxnet');
		let netDict = this.surfacenet;
		let k = this.relaxSpeed;
		let dist = this.dist;
		let distx = dist[0];
		let disty = dist[1];
		let distz = dist[2];
		let xflag = 1 << AdjNode.PX;
		let yflag = 1 << AdjNode.PY;
		let zflag = 1 << AdjNode.PZ;
		let nets = this.dbgSurfaceNet;
		let nn = nets.length;
		let dims = this.dims;

		let pxflag = 1 << AdjNode.PX;
		let pyflag = 1 << AdjNode.PY;
		let pzflag = 1 << AdjNode.PZ;
		let nxflag = 1 << AdjNode.NX;
		let nyflag = 1 << AdjNode.NY;
		let nzflag = 1 << AdjNode.NZ;
		let v0f = pxflag | pyflag | nzflag;
		let v1f = nxflag | pyflag | nzflag;
		let v2f = nxflag | pyflag | nzflag;
		let v3f = pxflag | pyflag | pzflag;
		let v4f = pxflag | nyflag | nzflag;
		let v5f = nxflag | nyflag | nzflag;
		let v6f = nxflag | nyflag | pzflag;
		let v7f = pxflag | nyflag | pzflag;


		for (let i = 0; i < it; i++) {
			// 清零
			for (let ni = 0; ni < nn; ni++) {
				nets[ni].resetTarget();
			}
			// 互相影响
			for (let ni = 0; ni < nn; ni++) {
				let cn = nets[ni];
				let cid = cn.voxID;
				let adjinfo = cn.linkInfo;
				if (adjinfo & xflag) {
					let nxn = netDict[cid + distx];	// TODO 注意这里可能会绕到错误的地方
					cn.adjbynode(nxn);
				}
				if (adjinfo & yflag) {
					let nyn = netDict[cid + disty];
					cn.adjbynode(nyn);
				}
				if (adjinfo & zflag) {
					let nzn = netDict[cid + distz];
					cn.adjbynode(nzn);
				}
			}

			// 朝目标移动。
			for (let ni = 0; ni < nn; ni++) {
				let cn = nets[ni];
				let voxid = cn.voxID;
				let ln = cn.linkeNodeNum;	// 这里除是为了效率
				cn.tmpx /= ln;
				cn.tmpy /= ln;
				cn.tmpz /= ln;

				let ox = voxid % dims[0]
				let oy = int1[1] = voxid / dist[1];	// y = id/(xsize*zsize)
				let oz = int1[0] = voxid / dims[0] % dims[2];	// z = id/xsize%zsize. x部分变成小数被丢掉，剩下的是 y*zsize+z
				cn.step(k);
				let linkinfo = cn.linkInfo&0b111111;
				if(linkinfo==v0f || linkinfo==v1f ||linkinfo==v2f ||linkinfo==v3f ||
					linkinfo==v4f ||linkinfo==v5f ||linkinfo==v6f ||linkinfo==v7f ){
					}
				else{
				if (cn.posx < ox - 0.5) cn.posx = ox - 0.5;
				if (cn.posx > ox + 0.5) cn.posx = ox + 0.5;
				if (cn.posy < oy - 0.5) cn.posy = oy - 0.5;
				if (cn.posy > oy + 0.5) cn.posy = oy + 0.5;
				if (cn.posz < oz - 0.5) cn.posz = oz - 0.5;
				if (cn.posz > oz + 0.5) cn.posz = oz + 0.5;
				}
			}
		}
		console.timeEnd('relaxnet');
	}

	private calcNormal(x0: number, y0: number, z0: number, v1: SurfaceNetNode, v2: SurfaceNetNode, order12: boolean, norm: Vector3) {
		let d1 = SurfaceNetSmoother.d1;
		let d2 = SurfaceNetSmoother.d2;
		d1.x = v1.posx - x0;
		d1.y = v1.posy - y0;
		d1.z = v1.posz - z0;
		d2.x = v2.posx - x0;
		d2.y = v2.posy - y0;
		d2.z = v2.posz - z0;

		if (order12) {
			Vector3.cross(d1, d2, norm);
		} else {
			Vector3.cross(d2, d1, norm);
		}
	}

	private pushVB(vb: number[], v0: SurfaceNetNode, v1: SurfaceNetNode, v2: SurfaceNetNode, norm: Vector3, order12:boolean=true) {
		vb.push(v0.posx, v0.posy, v0.posz, norm.x, norm.y, norm.z);
		if(order12){
			vb.push(v1.posx, v1.posy, v1.posz, norm.x, norm.y, norm.z);
			vb.push(v2.posx, v2.posy, v2.posz, norm.x, norm.y, norm.z);
		}else{
			vb.push(v2.posx, v2.posy, v2.posz, norm.x, norm.y, norm.z);
			vb.push(v1.posx, v1.posy, v1.posz, norm.x, norm.y, norm.z);
		}
	}

	toMeshes() {
		console.time('tomesh');
		let vertex: number[] = [];
		let index: number[] = [];
		let vn = 0;
		let totalvn = 0;
		var vertDecl = VertexMesh.getVertexDeclaration("POSITION,NORMAL");
		let norm = new Vector3();
		let ret: Mesh[] = [];
		let distx = this.dist[0];
		let disty = this.dist[1];
		let distz = this.dist[2];
		let pxflag = 1 << AdjNode.PX;
		let pyflag = 1 << AdjNode.PY;
		let pzflag = 1 << AdjNode.PZ;
		let nxflag = 1 << AdjNode.NX;
		let nyflag = 1 << AdjNode.NY;
		let nzflag = 1 << AdjNode.NZ;


		let netsDict = this.surfacenet;
		let nets = this.dbgSurfaceNet;
		let data = this.data;
		let n = nets.length;
		// 先添加顶点，记录顶点id
		/*
		for (let i = 0; i < n; i++) {
			let cn = nets[i];
		}
		*/
		for (let i = 0; i < n; i++) {
			let cn = nets[i];
			let cx = cn.posx;
			let cy = cn.posy;
			let cz = cn.posz;
			let vid = cn.voxID;

			let linkinfo = cn.linkInfo;
			let bpx = (linkinfo & pxflag) != 0;
			let bpy = (linkinfo & pyflag) != 0;
			let bpz = (linkinfo & pzflag) != 0;
			let bnx = (linkinfo & nxflag) != 0;
			let bny = (linkinfo & nyflag) != 0;
			let bnz = (linkinfo & nzflag) != 0;

			// 根据相邻点来构造三角形

			// 每个点自己构造的三角形类型会保存起来（作为其他三角形的构成部分的不算）
			// 当其他三角形需要这个点的时候，会检查是否冲突。
			//    |
			//  /1|0\
			// ---+---
			//  \2|3/  
			//    |

			// xy平面
			if (bpx && bpy) {
				let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
				let vpy = netsDict[vid + disty];
	
				let pxlink = vpx.linkInfo;
				let pylink = vpy.linkInfo;
				//FaceID.PXPY;
				// 这个平面不能插入实体中，不能插入空气中
				if (pxlink & pyflag && pylink & pxflag &&
					(pxlink & FaceID.PYNX)==0 && (pylink&FaceID.NYPX)==0
					) {// 检查是否能构成四边形
					// 检查是否已经创建了
					let nzHasData = (((linkinfo | pxlink | pylink) >> 6)&nzflag)!=0 ||data[vid+distx+disty-distz]>0;	// nz是否有数据。任何一个有就算. // 可能对角点对应的nz有数据
					cn.linkInfo |=FaceID.PXPY;
					this.calcNormal(cx, cy, cz, vpx, vpy, nzHasData, norm);	// 下面是实心
					this.pushVB(vertex, cn, vpy, vpx, norm,nzHasData);
					index.push(vn, vn + 1, vn + 2);
					totalvn += 3;
					vn += 3;
				}
			}
			if (bpy && bnx) {
				let vpy = netsDict[vid + disty];
				let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
				let nxlink = vnx.linkInfo;
				let pylink = vpy.linkInfo;
	
				if (pylink & nxflag && nxlink & pyflag &&
					(pylink & FaceID.NXNY)==0 && (nxlink &FaceID.PXPY)==0
					) {// 检查是否能构成四边形
					let nzHasData = (((linkinfo | pylink | nxlink) >> 6)&nzflag)!=0 || data[vid+disty-distx-distz]>0;	// nz是否有数据。任何一个有就算
					cn.linkInfo |=FaceID.PYNX;
					this.calcNormal(cx, cy, cz, vpy, vnx, nzHasData, norm);	// 下面是实心
					this.pushVB(vertex, cn, vnx, vpy, norm,nzHasData);
					index.push(vn, vn + 1, vn + 2);
					totalvn += 3;
					vn += 3;
				}
			 }
			if (bnx && bny) {
				let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
				let vny = netsDict[vid - disty];

				let nxlink = vnx.linkInfo;
				let nylink = vny.linkInfo;
	
				if (nxlink & nyflag && nylink & nxflag &&
					(nxlink & FaceID.NYPX)==0 && (nylink &FaceID.PYNX)==0
					) {// 检查是否能构成四边形
					let nzHasData = (((linkinfo | nxlink | nylink) >> 6)&nzflag)!=0 ||data[vid-distx-disty-distz]>0;	// nz是否有数据。任何一个有就算
					cn.linkInfo |=FaceID.NXNY;
					this.calcNormal(cx, cy, cz, vnx, vny, nzHasData, norm);	// 下面是实心
					this.pushVB(vertex, cn, vny, vnx, norm,nzHasData);
					index.push(vn, vn + 1, vn + 2);
					totalvn += 3;
					vn += 3;
				}
			 }
			if (bny && bpx) {  }

			// xz 平面
			if (bpx && bnz) {
				let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
				let vnz = netsDict[vid - distz];
	
				let pxlink = vpx.linkInfo;
				let nzlink = vnz.linkInfo;
				if(pxlink&nzflag && nzlink&pxflag &&
					(nzlink&FaceID.PZPX)==0 && (pxlink&FaceID.NZNX)==0){
						let nyhasData = (((linkinfo|pxlink|nzlink)>>6)&nyflag)!=0 || data[vid+distx-distz-disty]>0;
						cn.linkInfo|=FaceID.PXNZ;
						this.calcNormal(cx,cy,cz,vpx,vnz,nyhasData,norm);
						this.pushVB(vertex,cn,vnz,vpx,norm,nyhasData);
						index.push(vn,vn+1,vn+2);
						totalvn+=3;
						vn+=3;
					}
			 }

			if (bnz && bnx ) { 
				let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
				let vnz = netsDict[vid - distz];
	
				let nzlink = vnz.linkInfo;
				let nxlink = vnx.linkInfo;
				if(nzlink&nxflag && nxlink&nzflag &&
					(nzlink&FaceID.NZNX)==0 && (nxlink&FaceID.PXNZ)==0){
						let nyhasData = (((linkinfo|nxlink|nzlink)>>6)&nyflag)!=0 || data[vid-distx-distz-disty]>0;
						cn.linkInfo|=FaceID.NZNX;
						this.calcNormal(cx,cy,cz,vnz,vnx,nyhasData, norm);
						this.pushVB(vertex,cn,vnx,vnz,norm, nyhasData);
						index.push(vn,vn+1,vn+2);
						totalvn+=3;
						vn+=3;
					}
			}

			if (bnx && bpz) {
				let vpz = netsDict[vid + distz];
				let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
	
				let nxlink = vnx.linkInfo;
				let pzlink = vpz.linkInfo;
				if(nxlink&pzflag && pzlink&nxflag &&
					(nxlink&FaceID.PZPX)==0 && (pzlink&FaceID.NZNX)==0){
						let nyhasData = (((linkinfo|nxlink|pzlink)>>6)&nyflag)!=0 || data[vid-distx+distz-disty]>0;
						cn.linkInfo|=FaceID.NXPZ
						this.calcNormal(cx,cy,cz,vnx, vpz,nyhasData, norm);
						this.pushVB(vertex,cn,vpz,vnx,norm,nyhasData);
						index.push(vn,vn+1,vn+2);
						totalvn+=3;
						vn+=3;
					}
			 }
			if (bnz && bpx) { }

			// yz 平面
			if (bpz && bpy) { 
				let vpy = netsDict[vid + disty];
				let vpz = netsDict[vid + distz];
	
				let pzlink = vpz.linkInfo;
				let pylink = vpy.linkInfo;
				if(pzlink&pyflag && pylink&pzflag &&
					(pzlink&FaceID.PYNZ)==0&&(pylink&FaceID.NYPZ)==0){
						let pxhasData = (((linkinfo|pzlink|pylink)>>6)&pxflag)!=0 || data[vid+distz+disty+distx]>0
						cn.linkInfo|=FaceID.PZPY;
						this.calcNormal(cx,cy,cz,vpz, vpy,pxhasData, norm);
						this.pushVB(vertex,cn,vpy,vpz,norm,pxhasData);
						index.push(vn,vn+1,vn+2);
						totalvn+=3;
						vn+=3;
					}
			}
			if (bpy && bnz ) { 
				let vpy = netsDict[vid + disty];
				let vnz = netsDict[vid - distz];
	
				let pylink = vpy.linkInfo;
				let nzlink = vnz.linkInfo;
				if(pylink&nzflag && nzlink&pyflag &&
					(pylink&FaceID.NZNY)==0&&(nzlink&FaceID.PZPY)==0){
						let pxhasData = (((linkinfo|pylink|nzlink)>>6)&pxflag)!=0 || data[vid-distz+disty+distx]>0
						cn.linkInfo|=FaceID.PYNZ;
						this.calcNormal(cx,cy,cz,vpy, vnz,pxhasData, norm);
						this.pushVB(vertex,cn,vnz,vpy,norm,pxhasData);
						index.push(vn,vn+1,vn+2);
						totalvn+=3;
						vn+=3;
					}

			}
			if (bnz && bny) { 
				let vny = netsDict[vid - disty];
				let vnz = netsDict[vid - distz];
	
				let nzlink = vnz.linkInfo;
				let nylink = vny.linkInfo;
				if(nzlink&nyflag && nylink&nzflag &&
					(nzlink&FaceID.NYPZ)==0&&(nylink&FaceID.PYNZ)==0){	// NY->PY  PZ->NZ
						let pxhasData = (((linkinfo|nylink|nzlink)>>6)&pxflag)!=0 || data[vid-distz-disty+distx]>0
						cn.linkInfo|=FaceID.NZNY;
						this.calcNormal(cx,cy,cz,vnz, vny,pxhasData, norm);
						this.pushVB(vertex,cn,vny,vnz,norm,pxhasData);
						index.push(vn,vn+1,vn+2);
						totalvn+=3;
						vn+=3;
					}				
			}

			if (bny && bpz) { }

			if (vn > 60 * 1024) {
				vn = 0;
				let vert = new Float32Array(vertex);
				let idx = new Uint16Array(index);
				ret.push((PrimitiveMesh as any)._createMesh(vertDecl, vert, idx) as Mesh);
				vertex.length = 0;
				index.length = 0;
			}
		}

		if (index.length > 0) {
			let vert = new Float32Array(vertex);
			let idx = new Uint16Array(index);
			ret.push((PrimitiveMesh as any)._createMesh(vertDecl, vert, idx) as Mesh);
		}
		console.timeEnd('tomesh');
		console.log('totalVertex=', totalvn);
		return ret;
	}

}

