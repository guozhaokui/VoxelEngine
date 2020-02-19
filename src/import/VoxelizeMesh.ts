import { Vector3 } from "laya/d3/math/Vector3";
import { Vector4 } from "laya/d3/math/Vector4";

function verifyBE(v:number,s:number){
    if(v<s)
        throw ('param error');
}

export class VoxelizeMesh{
    /** 所有面的法线 */
    faceNormals:Vector4[]=[];   //法线和d
    xysurface:number[][][]; //每个元素保存的是一个{faceid,dist}
    yzsurface:number[][][];
    xzsurface:number[][][];
    scale=1;
    meshMin:number[]=[0,0,0];
    meshMax:number[]=[0,0,0];

    posBuffer:Float32Array;
    xySurface:number[][];
    xzSurface:number[][];
    yzSurface:number[][];

    private static tmpNorm = new Vector3();
    private static tmpVec30=new Vector3();
    private static tmpVec31=new Vector3();
    private static nV0=[0,0,0];
    private static nV1=[0,0,0];
    private static nV2=[0,0,0];

    toVoxel(vertices:number[], indices:number[], vertexSize:int, gridsize:number, data:any, flipNormal:boolean){
        this.scale=1/gridsize;
        if(vertexSize<=0){
            throw 'err';
        }
        var vertnum = vertices.length / vertexSize;
        verifyBE(vertnum,3);
        var vertex = this.posBuffer = new Float32Array(vertnum*3);
        
        // 计算包围盒
		let min = this.meshMin;
		let max = this.meshMax;
        for (var vi = 0; vi < vertnum; vi++) {
			let cx = vertices[vi * 3];		//x
			let cy = vertices[vi * 3 + 1];	//y;
			let cz = vertices[vi * 3 + 2];	//z
			if(vi==0){
				min[0]=max[0]=cx;
				min[1]=max[1]=cy;
				min[2]=max[2]=cz;
			}else{
				min[0]=Math.min(min[0],cx);min[1]=Math.min(min[1],cy);min[2]=Math.min(min[2],cz);
				max[0]=Math.max(max[0],cx);max[1]=Math.max(max[1],cy);max[2]=Math.max(max[2],cz);
			}
        }
		let ext = 2;
		min[0]-=ext; min[1]-=ext; min[2]-=ext;
		max[0]+=ext; max[1]+=ext; max[2]+=ext;

        // 转到正区间
        this.transMesh();

        // 计算面法线
        this.calcFaceNormal(flipNormal);

        // 构造三个平面

        // 遍历所有的三角形，填充三个平面

    }

    private calcFaceNormal(flip:boolean){

    }
    /**
     * 移到正区间。缩放
     */
	private transMesh(){
		let vb = this.posBuffer;
        let min = this.meshMin;
        let scale = this.scale;
		let minx=min[0];
		let miny=min[1];
		let minz=min[2];
        let max = this.meshMax;

		let vertnum = vb.length/3;
		let posst =0;
		for(let i=0; i<vertnum; i++){
			let cx = vb[posst];
			let cy = vb[posst+1];
			let cz = vb[posst+2];
			vb[posst] = (cx-minx)*scale;
			vb[posst+1] = (cy-miny)*scale;
			vb[posst+2] = (cz-minz)*scale;
			posst+=3;
		}
    }    
    
    private fill(vertices:Float32Array, indices:number[], flipNormal:boolean){
        var faceNum = indices.length / 3;
        var fidSt = 0;
        var v0=[0,0,0];
        var v1=[0,0,0];
        var v2=[0,0,0];
        var norm = VoxelizeMesh.tmpNorm;
        for (var fi = 0; fi < faceNum; fi++) {
            var v0id = indices[fidSt++]*3;
            var v1id = indices[fidSt++]*3;
            var v2id = indices[fidSt++]*3;

            //三个顶点的贴图必然一致。只取第一个就行了
            v0[0] = vertices[v0id];
            v0[1] = vertices[v0id+1];
            v0[2] = vertices[v0id+2];

            v1[0] = vertices[v1id];
            v1[1] = vertices[v1id+1];
            v1[2] = vertices[v1id+2];

            v2[0] = vertices[v2id];
            v2[1] = vertices[v2id+1];
            v2[2] = vertices[v2id+2];

            // 计算法线
            var e1 = VoxelizeMesh.tmpVec30;
            var e2 = VoxelizeMesh.tmpVec31;
            e1.x = v1[0] - v0[0];
            e1.y = v1[1] - v0[1];
            e1.z = v1[2] - v0[2];
            e2.x = v2[0] - v0[0];
            e2.y = v2[1] - v0[1];
            e2.z = v2[2] - v0[2];
            if(flipNormal){
                Vector3.cross(e2, e1, norm);	
            }else{
                Vector3.cross(e1, e2, norm);
            }
            Vector3.normalize(norm,norm);
            if(norm.x==0 && norm.y==0 && norm.z==0)
                continue;            

            let planeD =  norm.x*v0[0]+norm.y*v0[1]+norm.z*v0[2];
            // 投影，填充
            // 投影到xy平面
            // 投影到xz平面
            // 投影到yz平面
            this.fill_2d(0,v0,v1,v2);
            this.fill_2d(1,v0,v1,v2);
            this.fill_2d(2,v0,v2,v2);
        }

    }

    fill_2d(axisID:int,v0:number[],v1:number[],v2:number[]): void {
		let nv0 = VoxelizeMesh.nV0;
		let nv1 = VoxelizeMesh.nV1;
        let nv2 = VoxelizeMesh.nV2;
        nv0[0]=v0[0]|0;nv0[1]=v0[1]|0;nv0[2]=v0[2]|0;
        nv1[0]=v1[0]|0;nv1[1]=v1[1]|0;nv1[2]=v1[2]|0;
        nv2[0]=v2[0]|0;nv2[1]=v2[1]|0;nv2[2]=v2[2]|0;

		// 三个点按照2d的y轴排序，下面相当于是展开的冒泡排序,p0的y最小
		let xid = (axisID+1)%3;
		let yid = (axisID+2)%3;
		var temp;
		var temp1;
        if (nv0[yid] > nv1[yid]) {
			temp = nv1; nv1 = nv0; nv0 = temp;
			temp1 = v1; v1=v0; v0=temp1;
        }

        if (nv1[yid] > nv2[yid]) {
            temp = nv1; nv1 = nv2; nv2 = temp;
            temp1 = v1; v1 = v2; v2 = temp1;
        }

        if (nv0[yid] > nv1[yid]) {
            temp = nv1; nv1 = nv0; nv0 = temp;
            temp1 = v1; v1 = v0; v0 = temp1;
        }

        var y: int = 0;
        var turnDir: number = (nv1[xid] - nv0[xid]) * (nv2[yid] - nv0[yid]) - (nv2[xid] - nv0[xid]) * (nv1[yid] - nv0[yid]);
		if (turnDir >= 0) {// >0 则v0-v2在v0-v1的右边，即向右拐。 在一条线上也走这个流程
            // v0
            // -
            // -- 
            // - -
            // -  -
            // -   - v1
            // -  -
            // - -
            // -
            // v2
            for (y = nv0[yid]; y <= nv2[yid]; y++) {
				// y分成两部分处理
                if (y < nv1[yid]) {
					// 上半部分。 v0-v2 扫描到 v0-v1
                    this.processScanLine(y, nv0, nv2, nv0, nv1,axisID);
                }
                else {
                    this.processScanLine(y, nv0, nv2, nv1, nv2,axisID);
                }
            }
        } else {	// 否则，左拐
            //       v0
            //        -
            //       -- 
            //      - -
            //     -  -
            // v1 -   - 
            //     -  -
            //      - -
            //        -
            //       v2
            for (y = nv0[yid]; y <= nv2[yid]; y++) {
                if (y < nv1[yid]) {
                    this.processScanLine(y, nv0, nv1, nv0, nv2,axisID);
                }
                else {
                    this.processScanLine(y, nv1, nv2, nv0, nv2,axisID);
                }
            }
        }
    }

    private interpolate(min: number, max: number, gradient: number) {
        return min + (max - min) * gradient;
    }

    // y是当前y，pa,pb 是左起始线，pc,pd 是右结束线
    private processScanLine(y: int,pa:int[], pb:int[], pc:int[], pd:int[], axisID:int): void {
		let xid = (axisID+1)%3;
		let yid = (axisID+2)%3;
        // 水平线的处理，需要考虑谁在左边,
        // papb 可能的水平
        //   pb-----pa
        //   pa
        //   \
        //    \
        //    pb
        //  或者
        //    /pa
        //   /
        //  pb pa-----pb
        // pcpd 可能的水平
        //    pc----pd
        //        pc
        //       /
        //      /
        //      pd
        //  或者
        //     pc
        //      \
        //       \pd
		//   pd---pc
		// gradient1 = (y-pa.y) /(pb.y-pa.y) 然后根据这个计算对应的 sx,sz 
		//let fy = (y+0.5)*w;
        var gradient1 = pa[yid] != pb[yid] ? (y - pa[yid]) / (pb[yid] - pa[yid]) : (pa[xid] > pb[xid] ? 1 : 0);	// y的位置，0 在pa， 1在pb
        var gradient2 = pc[yid] != pd[yid] ? (y - pc[yid]) / (pd[yid] - pc[yid]) : (pc[xid] > pd[xid] ? 0 : 1); // pc-pd

        var sx: int = Math.round(this.interpolate(pa[xid], pb[xid], gradient1))-1;	// 扩大一下，防止投影面变化的地方漏了
        var ex: int = Math.round(this.interpolate(pc[xid], pd[xid], gradient2))+1;
        //var su: number = this.interpolate(fpa[3], fpb[3], gradient1);
        //var eu: number = this.interpolate(fpc[3], fpd[3], gradient2);
        //var sv: number = this.interpolate(fpa[4], fpb[4], gradient1);
        //var ev: number = this.interpolate(fpc[4], fpd[4], gradient2);

		var x: int = 0;
		// x每一步走多少
        //var stepx: number = ex != sx ? 1 / (ex - sx) : 0;
        //var kx: number = 0;
        /*
		let min = this.nmin;
		let max = this.nmax;
		let grid = this.curGrid;
		grid[axisID]=0;
		grid[yid]=y;
		let norm = this.normArr;
		let planeD = this.planeD;
		for (x = sx; x <= ex; x++) {
			grid[xid]=x;
			//this.hitRange(min,max,grid,norm, planeD, axisID);
        }
        */
    }    
}