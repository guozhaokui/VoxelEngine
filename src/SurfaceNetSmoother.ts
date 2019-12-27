import { BoundBox } from "laya/d3/math/BoundBox";

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

	nextX=-1;		// 下一个相连的节点id。-1表示没有。每次处理的时候会把自己加到对方，同时把对方加到自己。
	nextY=-1;
	netxZ=-1;
	linkeNodeNum=0; 	// 连接的节点数。上面只记录的下一个，连接的要把只想自己的也算上。每个最多有6个：两个角的顶角处
	//nextNodes:SurfaceNets[]=[];

	resetTarget(){
		this.tmpx=this.tmpy=this.tmpz=0;
	}

	step(k:number){
		this.adjx=this.adjx+ (this.tmpx - this.adjx)*k;
		this.adjy=this.adjy+ (this.tmpy - this.adjy)*k;
		this.adjz=this.adjz+ (this.tmpz - this.adjz)*k;
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

function isBorder(data:Float32Array, dims:number[], x:int,y:int,z:int){
	return false;
}

export class SurfaceNetSmoother{
	private surfacenet:SurfaceNetNode[]=[];
	relaxSpeed=0.5;
	/**
	 * 创建表面节点网，这个网上的点是距离值为0的点
	 * 不允许出现粗细为1的形状，会被忽略
	 * @param data 值只能是0或者1
	 */
	createSurfaceNet(data:Float32Array, dims:number[]){
		let xn=dims[0];
		let yn=dims[1];
		let zn=dims[2];

		let dx =1;
		let dy = xn*zn;
		let dz = xn;

		// 找出所有的边界

		// 针对边界分别扫描xyz进行连接

		// 扫描x
		for(let x=0; x<xn; x++){
			for(let y=0; y<yn; y++){
				for(let z=0; z<zn; z++){
					// 自己是边界，并且右边也是边界。边界的条件是自己是1且26个邻格有0
					if(isBorder(data,dims,x,y,z) && isBorder(data,dims,x+1,y,z)){

					}
				}
			}
		}
		// 扫描y
		for(let i=0; i<yn; i++){

		}
		// 扫描z
		for(let i=0; i<zn; i++){

		}
	}

	/**
	 * 只更新局部
	 * @param aabb 
	 */
	public updateRegin(aabb:BoundBox){
		// 扩大一下范围
	}

	/**
	 * 放松网络
	 * @param it  次数
	 */
	private relaxSurfaceNet(it:number){
		let net = this.surfacenet;
		let k = this.relaxSpeed;
		let n = net.length;
		// 清零
		for(let n=0; n<n; n++){
			let cn = net[n];
			cn.resetTarget();
		}

		for(let i=0; i<it; i++){
			// 互相影响
			for(let n=0; n<n; n++){
				let cn = net[n];
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
				let ln = cn.linkeNodeNum;
				cn.tmpx/=ln;
				cn.tmpy/=ln;
				cn.tmpz/=ln;
				cn.step(k);
			}
		}
	}	
}