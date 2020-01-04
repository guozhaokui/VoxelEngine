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
 * 
 * 注意：
 * 	边界在外面，对应空心的
 */

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
	NZ = 5
}

/**
 * 每种边界情况对应的三角形列表
 * <3个邻点都不组成三角形
 * 按照顺时针朝外试试
 * 当前点都在中间，不写了，所以每个三角形只记两个点
 */
const TriTrable = [
	[],//0		<3个都不能组成
	[],//1
	[],//10
	[],//11
	[],//100
	[],//101
	[],//110
	//111
	[],//1000
	[],//1001
	[],//1010
	//1011
	[],//1100
	//1101
	//1110
	//1111
	[],//10000
	[],//10001
	[],//10010
	//10011
	[],//10100
	//10101
	//10110
	//10111
	[],//11000
	//11001
	//11010
	//11011
	//11100
	//11101
	//11110
	//11111
	[],//100000
	[],//100001
	[],//100010
	//100011
	[],//100100
	//100101
	//100110
	//100111
	[],//101000
	//101001
	//101010
	//101011	0,1,3,5 平面十字
	//101100
	//101101		
	//101110
	//101111
	[],//110000
	//110001
	//110010
	//110011
	//110100
	//110101
	//110110
	//110111
	//111000
	//111001
	//111010
	//111011
	//111100
	//111101
	//111110
	[]//111111
];


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
	adjInfo = 0; 		// 前6个bit，每个bit表示对应的相邻位是否有实心voxel。这些也为计算法线提供信息。 TODO 可以不用

	linkInfo = 0; 		// 前6个bit，每个bit表示对应的相邻位是否有表面节点
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

	get linkInfoStr(){
		return ((this.linkInfo&(1<<AdjNode.PX))?'PX ':'')+
		((this.linkInfo&(1<<AdjNode.PY))?'PY ':'')+
		((this.linkInfo&(1<<AdjNode.PZ))?'PZ ':'')+
		((this.linkInfo&(1<<AdjNode.NX))?'NX ':'')+
		((this.linkInfo&(1<<AdjNode.NY))?'NY ':'')+
		((this.linkInfo&(1<<AdjNode.NZ))?'NZ ':'');
	}
}

let int1 = new Uint32Array(2);

export class SurfaceNetSmoother {
	private static d1 = new Vector3();
	private static d2 = new Vector3();

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

	private isBorder(id: int): boolean {
		let data = this.data;
		let nb = this.neighbors;
		//if( x==0 || y==0 || z==0 || x==dims[0]-1 || y==dims[1]-1 || z==dims[2]-1 )
		//	return true;

		// 注意现在假设空的地方为0。 注意不要位置浸染
		// 兼容 0空 1实   -1空 1实
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
				let adjinfo = cn.linkInfo;
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

	private calcNormal(x0:number,y0:number, z0:number, v1:SurfaceNetNode, v2:SurfaceNetNode, order12:boolean, norm:Vector3){
		let d1 = SurfaceNetSmoother.d1;
		let d2 = SurfaceNetSmoother.d2;
		d1.x = v1.posx - x0;
		d1.y = v1.posy - y0;
		d1.z = v1.posz - z0;
		d2.x = v2.posx - x0;
		d2.y = v2.posy - y0;
		d2.z = v2.posz - z0;

		if (order12) {
			//如果下面是实心
			Vector3.cross(d1, d2, norm);
		} else {
			//如果上面是实心
			Vector3.cross(d2, d1, norm);
		}
	}

	private pushVB(vb:number[], v0:SurfaceNetNode, v1:SurfaceNetNode, v2:SurfaceNetNode, norm:Vector3){
		vb.push(v0.posx,v0.posy,v0.posz, norm.x, norm.y, norm.z, 0, 0);
		vb.push(v1.posx, v1.posy, v1.posz, norm.x, norm.y, norm.z, 0, 0);
		vb.push(v2.posx, v2.posy, v2.posz, norm.x, norm.y, norm.z, 0, 0);
	}

	toMeshes() {
		let vertex: number[] = [];
		let index: number[] = [];
		let vn = 0;
		let totalvn = 0;
		var vertDecl = VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
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
		let xzface = pxflag|nxflag|pzflag|nzflag;
		let xyface = pxflag|pyflag|nxflag|nyflag;
		let yzface = pyflag|nyflag|pzflag|nzflag;
		let e0 = pyflag|nzflag|pxflag|nxflag;
		let e1 = pyflag|nxflag|pzflag|nzflag;
		let e2 = pxflag|nxflag|pyflag|pzflag;
		let e3 = pzflag|nzflag|pyflag|pxflag;
		let e4 = pxflag|nxflag|nzflag|nyflag;
		let e5 = nxflag|nyflag|pzflag|nzflag;
		let e6 = pxflag|nxflag|pzflag|nyflag;
		let e7 = pxflag|nyflag|pzflag|nzflag;
		let e8 = pxflag|nzflag|pyflag|nyflag;
		let e9 = nxflag|nzflag|pyflag|nyflag;
		let e10 = nxflag|pzflag|pyflag|nyflag;
		let e11 = pyflag|nyflag|pxflag|pzflag;
		let v0f = pxflag|pyflag|nzflag;
		let v1f = nxflag|pyflag|nzflag;
		let v2f = nxflag|pyflag|nzflag;
		let v3f = pxflag|pyflag|pzflag;
		let v4f = pxflag|nyflag|nzflag;
		let v5f = nxflag|nyflag|nzflag;
		let v6f = nxflag|nyflag|pzflag;
		let v7f = pxflag|nyflag|pzflag;
		let facevt:SurfaceNetNode[]|null[]=new Array(6);
		/**
		 * 
		 *         
		 *     7-----e6-----6
		 *    /            /|
		 *   e7          e5 |
		 *  /  e11       / e10
		 * 4-----e4-----5   |
		 * |            |   |
		 * |    3     e2|   2
		 * e8          e9  / 
		 * |  e3        | e1
		 * |            |/
		 * 0-----e0-----1 
		 * 
		 * 
		 */

		let netsDict = this.surfacenet;
		let nets = this.dbgSurfaceNet;
		let data = this.data;
		let n = nets.length;
		for (let i = 0; i < n; i++) {
			let cn = nets[i];
			let cx = cn.posx;
			let cy = cn.posy;
			let cz = cn.posz;
			let vid = cn.voxID;

			// 根据相邻点来构造三角形
			switch(cn.linkInfo){
				case xzface:
					// 纯平面
					let vpx = netsDict[vid + distx];	//TODO 可能会溢出到别的地方
					let vpz = netsDict[vid + distz];
					let vnx = netsDict[vid - distx];
					let vnz = netsDict[vid - distz];

					//xz平面
					this.calcNormal(cx,cy,cz,vpz,vpx,data[vid - disty] > 0,norm);	// 下面是实心
					this.pushVB(vertex,cn,vpx,vpz,norm);

					//TODO 以后合并中间点
					// 与上面的区别仅仅是 vpx->vnx, vpz->vnz
					this.calcNormal(cx,cy,cz,vnz,vnx,data[vid - disty] > 0,norm);	// 下面是实心
					this.pushVB(vertex,cn,vnx,vnz,norm);
	
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				break;
				case yzface:{
					let vpy = netsDict[vid + disty];
					let vpz = netsDict[vid + distz];
					let vny = netsDict[vid - disty];
					let vnz = netsDict[vid - distz];					
					this.calcNormal(cx,cy,cz,vpy,vnz, data[vid+distx]>0 ,norm);
					this.pushVB(vertex,cn,vpy,vnz,norm);
					this.calcNormal(cx,cy,cz,vny,vpz, data[vid+distx]>0 ,norm);
					this.pushVB(vertex,cn,vny,vpz,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case xyface:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];
					this.calcNormal(cx,cy,cz,vpx,vpy, data[vid-distz]>0 ,norm);
					this.pushVB(vertex,cn,vpy,vpx,norm);
					this.calcNormal(cx,cy,cz,vnx,vny, data[vid-distz]>0 ,norm);
					this.pushVB(vertex,cn,vny,vnx,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e0:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vnz = netsDict[vid - distz];					
					this.calcNormal(cx,cy,cz,vpx,vpy,true,norm);
					this.pushVB(vertex,cn,vpx,vpy,norm);
					this.calcNormal(cx,cy,cz,vnx,vnz,true,norm);
					this.pushVB(vertex, cn, vnx,vnz,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e1:{
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vnz = netsDict[vid - distz];					
					this.calcNormal(cx,cy,cz,vnz,vpy,true,norm);
					this.pushVB(vertex,cn,vnz,vpy,norm);
					this.calcNormal(cx,cy,cz,vnx,vnz,true,norm);
					this.pushVB(vertex, cn, vnx,vnz,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e2:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vpz = netsDict[vid + distz];
					this.calcNormal(cx,cy,cz,vpy,vpx,true,norm);
					this.pushVB(vertex,cn,vpy,vpx,norm);
					this.calcNormal(cx,cy,cz,vpx,vpz,true,norm);
					this.pushVB(vertex,cn,vpx,vpz,norm);

					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;

				}
				break;
				case e3:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vpz = netsDict[vid + distz];
					let vnz = netsDict[vid - distz];					
					this.calcNormal(cx,cy,cz, vpy,vnz,true,norm);
					this.pushVB(vertex,cn,vpy,vnz,norm);
					this.calcNormal(cx,cy,cz,vpx,vpz,true,norm);
					this.pushVB(vertex,cn,vpx,vpz,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e4:{
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];
					let vnz = netsDict[vid - distz];					
					this.calcNormal(cx,cy,cz, vnz,vnx,true,norm);
					this.pushVB(vertex,cn,vnz,vnx,norm);
					this.calcNormal(cx,cy,cz,vnx,vny,true,norm);
					this.pushVB(vertex,cn,vnx,vny,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e5:{
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vnz = netsDict[vid - distz];					
					let vpz = netsDict[vid + distz];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];

					this.calcNormal(cx,cy,cz, vnz,vnx,true,norm);
					this.pushVB(vertex,cn,vnz,vnx,norm);
					this.calcNormal(cx,cy,cz,vpz,vny,true,norm);
					this.pushVB(vertex,cn,vpz,vny,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e6:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpz = netsDict[vid + distz];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];
					this.calcNormal(cx,cy,cz, vny,vnx,true,norm);
					this.pushVB(vertex,cn,vny,vnx,norm);
					this.calcNormal(cx,cy,cz,vpz,vpx,true,norm);
					this.pushVB(vertex,cn,vpz,vpx,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e7:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpz = netsDict[vid + distz];
					let vny = netsDict[vid - disty];
					this.calcNormal(cx,cy,cz,vpz,vpx,true,norm);
					this.pushVB(vertex,cn,vpz,vpx,norm);

					this.calcNormal(cx,cy,cz,vny, vpz,true,norm);
					this.pushVB(vertex,cn,vpz,vny,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;

				}
				break;
				case e8:{
					/**    ^
					 *   / | \
					 * /---|--\
					 */
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vnz = netsDict[vid - distz];					
					this.calcNormal(cx,cy,cz,vpx, vpy,true,norm);
					this.pushVB(vertex,cn,vpx,vpy,norm);
					this.calcNormal(cx,cy,cz,vpy, vnz,true,norm);
					this.pushVB(vertex,cn,vpy,vnz,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e9:{
					let vpy = netsDict[vid + disty];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];
					let vnz = netsDict[vid - distz];					
					this.calcNormal(cx,cy,cz,vnz, vpy,true,norm);
					this.pushVB(vertex,cn,vnz,vpy,norm);
					this.calcNormal(cx,cy,cz,vnx, vny,true,norm);
					this.pushVB(vertex,cn,vnx,vny,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e10:{
					let vpz = netsDict[vid + distz];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];
					this.calcNormal(cx,cy,cz,vpz, vny,true,norm);
					this.pushVB(vertex,cn,vpz,vny,norm);
					this.calcNormal(cx,cy,cz,vny, vnx,true,norm);
					this.pushVB(vertex,cn,vny,vnx,norm);
					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case e11:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vpz = netsDict[vid + distz];
					let vny = netsDict[vid - disty];
					this.calcNormal(cx,cy,cz,vpy, vpx,true,norm);
					this.pushVB(vertex,cn,vpx,vpy,norm);
					this.calcNormal(cx,cy,cz,vny, vpz,true,norm);
					this.pushVB(vertex,cn,vpz,vny,norm);

					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case v0f:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vnz = netsDict[vid - distz];					

					this.calcNormal(cx,cy,cz,vpx, vpy,true,norm);
					this.pushVB(vertex,cn,vpx,vpy,norm);
					this.calcNormal(cx,cy,cz,vpy, vnz,true,norm);
					this.pushVB(vertex,cn,vpy,vnz,norm);

					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case v1f:{
					let vpy = netsDict[vid + disty];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vnz = netsDict[vid - distz];					

					this.calcNormal(cx,cy,cz,vnz, vpy,true,norm);
					this.pushVB(vertex,cn,vnz,vpy,norm);
					this.calcNormal(cx,cy,cz,vnx, vnz,true,norm);
					this.pushVB(vertex,cn,vnx,vnz,norm);

					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case v2f:{
					//不用做
				}
				break;
				case v3f:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vpz = netsDict[vid + distz];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];
					let vnz = netsDict[vid - distz];					

					this.calcNormal(cx,cy,cz,vpy, vpx,true,norm);
					this.pushVB(vertex,cn,vpy,vpx,norm);
					this.calcNormal(cx,cy,cz,vpx, vpz,true,norm);
					this.pushVB(vertex,cn,vpx,vpz,norm);

					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case v4f:{
					// 不用做
				}
				break;
				case v5f:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vpz = netsDict[vid + distz];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];
					let vnz = netsDict[vid - distz];					

					this.calcNormal(cx,cy,cz,vnz, vnx,true,norm);
					this.pushVB(vertex,cn,vnz,vnx,norm);
					this.calcNormal(cx,cy,cz,vnx, vny,true,norm);
					this.pushVB(vertex,cn,vnx,vny,norm);

					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case v6f:{
					let vpz = netsDict[vid + distz];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];

					this.calcNormal(cx,cy,cz,vpz, vny,true,norm);
					this.pushVB(vertex,cn,vpz,vny,norm);
					this.calcNormal(cx,cy,cz,vny, vnx,true,norm);
					this.pushVB(vertex,cn,vny,vnx,norm);

					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				case v7f:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpz = netsDict[vid + distz];
					let vny = netsDict[vid - disty];

					this.calcNormal(cx,cy,cz,vpz, vpx,true,norm);
					this.pushVB(vertex,cn,vpz,vpx,norm);
					this.calcNormal(cx,cy,cz,vny, vpz,true,norm);
					this.pushVB(vertex,cn,vpz,vny,norm);

					index.push(vn,vn+1,vn+2,vn+3,vn+4,vn+5);
					totalvn += 6;
					vn += 6;
				}
				break;
				default:{
					let vpx = netsDict[vid + distx];		//TODO 可能会溢出到别的地方
					let vpy = netsDict[vid + disty];
					let vpz = netsDict[vid + distz];
					let vnx = netsDict[vid - distx];		//TODO 可能会溢出到别的地方
					let vny = netsDict[vid - disty];
					let vnz = netsDict[vid - distz];					
				}
					break;
			}

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
		console.log('totalVertex=', totalvn);

		return ret;
	}
}

