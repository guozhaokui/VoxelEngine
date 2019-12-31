import { BoundBox } from "laya/d3/math/BoundBox";

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
 * 			两个格子的坑也会，需要>两个
 * 				  。---。
 *                |    |
 *          --。--。---。---
 * 
 */

class SurfaceNetNode{
	voxID:int=0;		// 最大允许1024**3。能反向得到xyz
	/** 调整后的位置 */
	adjx:number;
	adjy:number;
	adjz:number;
	/** 临时目标，因为不能一次处理，所以中间结果先保存在这里 */
	tmpx=0;
	tmpy=0;
	tmpz=0;

	nextX=-1;		// 下一个相连的节点id。-1表示没有。每次处理的时候会把自己加到对方，同时把对方加到自己。 用id是一个位置，比对象更容易维护
	nextY=-1;
	netxZ=-1;
	linkeNodeNum=0; 	// 连接的节点数。上面只记录的下一个，连接的要把指向自己的也算上。每个最多有6个：两个角的顶角处
	//nextNodes:SurfaceNets[]=[];

	resetTarget(){
		this.tmpx=this.tmpy=this.tmpz=0;
	}

	step(k:number){
		this.adjx=this.adjx+ (this.tmpx - this.adjx)*k;
		this.adjy=this.adjy+ (this.tmpy - this.adjy)*k;
		this.adjz=this.adjz+ (this.tmpz - this.adjz)*k;
		// TODO 约束到格子内
	}

	getDataID(){

	}

	adjbynode(n:SurfaceNetNode){
		this.tmpx+=n.adjx;
		this.tmpy+=n.adjy;
		this.tmpz+=n.adjz;

		n.tmpx+=this.adjx;
		n.tmpy+=this.adjy;
		n.tmpz+=this.adjz;
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
var neighborDir=[
	[-1,1,1], [-1,1,0], [-1,1,-1],  [0,1,1],  [0,1,0],  [0,1,-1],  [1,1,1], [1,1,0], [1,1,-1],	// 最上层，沿着x切
	[-1,0,1], [-1,0,0], [-1,0,-1],  [0,0,1],/*[0,0,0],*/[0,0,-1],  [1,0,1], [1,0,0], [1,0,-1],
	[-1,-1,1],[-1,-1,0],[-1,-1,-1], [0,-1,1], [0,-1,0], [0,-1,-1], [1,-1,1],[1,-1,0],[1,-1,-1],
];

export class SurfaceNetSmoother{
	private surfacenet:SurfaceNetNode[]=[];
	private dist=[0,0,0]
	relaxSpeed=0.5;
	private data:Float32Array;
	private dims:number[];
	private maxx=0;
	private maxy=0;
	private maxz=0;
	/** 26个相邻点的偏移。注意在边界的地方不允许使用 */
	private neighbors:number[]=[];

	private isBorder(id:int):boolean{
		let data = this.data;
		let nb = this.neighbors;
		//if( x==0 || y==0 || z==0 || x==dims[0]-1 || y==dims[1]-1 || z==dims[2]-1 )
		//	return true;

		// 注意现在假设空的地方为0。 注意不要位置浸染
		return data[id]==0 && (
			data[id+nb[0]]!=0||
			data[id+nb[1]]!=0||
			data[id+nb[2]]!=0||
			data[id+nb[3]]!=0||
			data[id+nb[4]]!=0||
			data[id+nb[5]]!=0||
			data[id+nb[6]]!=0||
			data[id+nb[7]]!=0||
			data[id+nb[8]]!=0||
			data[id+nb[9]]!=0||
			data[id+nb[10]]!=0||
			data[id+nb[11]]!=0||
			data[id+nb[12]]!=0||
			data[id+nb[13]]!=0||
			data[id+nb[14]]!=0||
			data[id+nb[15]]!=0||
			data[id+nb[16]]!=0||
			data[id+nb[17]]!=0||
			data[id+nb[18]]!=0||
			data[id+nb[19]]!=0||
			data[id+nb[20]]!=0||
			data[id+nb[21]]!=0||
			data[id+nb[22]]!=0||
			data[id+nb[23]]!=0||
			data[id+nb[24]]!=0||
			data[id+nb[25]]!=0||
			data[id+nb[26]]!=0);
	}

	/**
	 * 创建表面节点网，这个网上的点是距离值为0的点
	 * 不允许出现粗细为1的形状，会被忽略
	 * 数据格式先假设为 y 向上
	 * @param data 值只能是0或者1
	 */
	createSurfaceNet(data:Float32Array, dims:number[]){
		this.data=data;
		this.dims=dims;
		let xn=dims[0];
		let yn=dims[1];
		let zn=dims[2];

		let dx =1;
		let dy = xn*zn;
		let dz = xn;

		let dist = this.dist;
		dist[0] = dx;
		dist[1] = dy;
		dist[2] = dz;

		let neighbors = this.neighbors;
		neighbors.length=26;
		for(let i=0; i<26; i++){
			let ndir = neighborDir[i];
			neighbors[i]=ndir[0]+ndir[1]*dy+ndir[2]*dz;
		}
		
		let nets = this.surfacenet;

		let maxx=xn-1;
		let maxy=yn-1;
		let maxz=zn-1;

		console.time('findborder');
		let nodenum=0;
		// 找出所有的边界。为了简单，先不考虑最外一圈
		let nid=0;
		for(let y=1; y<maxy; y++){
			for(let z=1; z<maxz; z++){
				nid=y*dy+z*dz;
				nid+=1;
				for(let x=1; x<maxx; x++){
					if(data[nid]===0){
						if(this.isBorder(nid)){
							let n = new SurfaceNetNode();
							n.voxID=nid;
							n.adjx = x;
							n.adjy = y;
							n.adjz = z;
							nets[nid]=n;
							nodenum++;
						}
					}
					nid++;
				}
			}
		}
		console.log('nodenum=', nodenum);
		console.timeEnd('findborder');

		// 看所有的节点是否有相邻点。 没有的会被消掉
		let netNodes:SurfaceNetNode[]=[];
		for(let cn of nets){
			//TODO
			if(cn==undefined)
				continue;
			let id = cn.voxID;
			
			if(nets[id+1]){ 
				cn.nextX = id+1;
				cn.linkeNodeNum++;
				nets[id+1].linkeNodeNum++;
			}			
			if(nets[id+dy]){	// 注意如果是边缘的话这个会出错
				cn.nextY=id+dy;
				cn.linkeNodeNum++;
				nets[id+dy].linkeNodeNum++;
			}
			if(nets[id+dz]){
				cn.netxZ=id+dz;
				cn.linkeNodeNum++;
				nets[id+dz].linkeNodeNum++;
			}
			if(cn.linkeNodeNum>0){
				netNodes[id]=cn;
			}
		}
		nets = this.surfacenet = netNodes;
	}

	/**
	 * 只更新局部
	 * 问题：单向记录数据不便于更新数据（扩充一个边查找也可以）
	 * @param aabb 
	 */
	public updateRegin(aabb:BoundBox){
		// 扩大一下范围
	}

	/**
	 * 放松网络
	 * @param it  次数
	 */
	public relaxSurfaceNet(it:number){
		let net = this.surfacenet;
		let k = this.relaxSpeed;
		let n = net.length;
		// 清零
		for(let i=0; i<n; i++){
			let cn = net[i];
			cn && cn.resetTarget();
		}

		for(let i=0; i<it; i++){
			// 互相影响
			for( let cn of net ){
				if(!cn) continue;
				if(cn.nextX>0){
					let nxn = net[cn.nextX];
					cn.adjbynode(nxn);
				}
				if(cn.nextY>0){
					let nyn = net[cn.nextY];
					cn.adjbynode(nyn);
				}
				if(cn.netxZ>0){
					let nzn = net[cn.netxZ];
					cn.adjbynode(nzn);
				}
			}

			// 朝目标移动。
			for(let n=0; n<n; n++){
				let cn = net[n];
				if(!cn) continue;
				let ln = cn.linkeNodeNum;
				cn.tmpx/=ln;
				cn.tmpy/=ln;
				cn.tmpz/=ln;
				cn.step(k);
			}
		}
	}	
}

