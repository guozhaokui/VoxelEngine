import { Vector3 } from "laya/d3/math/Vector3";
import { Vector4 } from "laya/d3/math/Vector4";
import { PixelLineSprite3D } from "laya/d3/core/pixelLine/PixelLineSprite3D";
import { Color } from "laya/d3/math/Color";
import { VoxMesh } from "../VoxMesh";

function verifyBE(v:number,s:number){
    if(v<s)
        throw ('param error');
}

var dbgline:PixelLineSprite3D;

class VoxData{
    data:Float32Array;  // 为了能方便的实现原型，先用float
    xsize=0;
    ysize=0;
    zsize=0;
    adjy=0;
    adjz=0;
    init(xs:int,ys:int,zs:int){
        this.xsize=xs;
        this.ysize=ys;
        this.zsize=zs;
        this.data = new Float32Array(xs*ys*zs);
        this.data.fill(127);
        // z向上的格式
        this.adjy=xs;
        this.adjz=xs*ys;
        //this.adjy=xs*zs;
        //this.adjz=xs;
    }
    set(x:int,y:int,z:int,v:int){
        if(x<0||y<0||z<0||x>=this.xsize||y>=this.ysize||z>=this.zsize){
            throw('eee');
        }
        //console.log('set',x,y,z);
        this.data[x+y*this.adjy+z*this.adjz]=v;
    }
    get(x:int,y:int,z:int){
        if(x<0||y<0||z<0||x>=this.xsize||y>=this.ysize||z>=this.zsize){
            throw('eee');
        }
        //console.log('set',x,y,z);
        return this.data[x+y*this.adjy+z*this.adjz];
    }
}

class MultiDepthBuffer{
    private surface:number[][]=[];
    private dbgData:Uint8Array;
    private width:int=0;
    private height:int=0;
    private mainax:int=0;
    static coord=[0,0,0];
    /**
     * 
     * @param axid 0 x轴是深度，1 y轴是深度 2 z轴是深度
     */
    constructor(axid:int){
        this.mainax=axid;
    }
    alloc(w:int,h:int){
        this.width=w;
        this.height=h;
        var sz = w*h;
        this.surface.length=sz;
        var surf = this.surface;
        for(var i=0; i<sz; i++){
            surf[i]=[];
        }
        //DEBUG
        this.dbgData = new Uint8Array(this.surface.length)
    }

    private verifyxy(x:int,y:int){
        if(x<0||y<0||x>=this.width||y>=this.height){
            throw 'xy error'
        }
    }

    //DEBUG
    private getdbgFlag(x:int,y:int){
        return this.dbgData[x+y*this.width];
    }
    private setdbgFlag(x:int,y:int){
        this.dbgData[x+y*this.width]=1;
    }
    //DEBUG

    // dist 为负的表示法线与正方向相同，这样就不用区分左右方向了
    // 正好在边缘，而被忽略的怎么办， 左边有，右边在边缘算成没有了
    //      如果模型真的是封闭的，稍微扩大一点就能避免
    addDepth(x:int,y:int, dist:number){
        this.verifyxy(x,y);
        var idx = x+y*this.width;
        var one = this.surface[idx];
        var dirR = dist<0;
        var v = dirR?-dist:dist;
        var num = one.length;
        var find=false;
        for(var i=0; i<num; i++){
            let cv = one[i];
            if(cv==undefined) continue;

            var absv = cv<0?-cv:cv;
            // 同一个格子内的左右可以抵消，一次只能抵消一个
            if ((cv | 0) === -(dist | 0)) {
                one.splice(i, 1);
                return;
            }
            var d = absv-v;
            if(d>0){
                // 插入
                one.splice(i,0,dist);
                find=true;
                break;
            }
        }
        if(!find){
            one.push(dist);
        }
        //DEBUG
        if(x==12&&y==19){
            //debugger;
        }
        //DEBUG        
    }

    private transXYZ(x:int,y:int,z:int){
        var ret=MultiDepthBuffer.coord;
        var ax=this.mainax;
        ret[ax]=z;
        ret[(ax+1)%3]=x;
        ret[(ax+2)%3]=y;
        return ret;
    }

    // 去除中间数据， 每当遇到1和0的时候，就分别表示起点和终点
    cleanBuffer(data:VoxMesh){
        var ys = this.height;
        var xs = this.width;
        var cidx=0;
        var datanum=0;
        var state=0;
        var stv=0;
        var coord=MultiDepthBuffer.coord;
        var ax=this.mainax;
        var surface = this.surface;
        for(var y=0; y<ys; y++){
            coord[(ax+2)%3]=y;
            for(var x=0; x<xs; x++){
                coord[(ax+1)%3]=x;
                state=0;
                var one = surface[cidx++];
                var dtnum = one.length;
                for(var i=0; i<dtnum; i++){
                    var z = one[i];
                    var absv=z<0?-z:z;
                    var gridz = absv|0;
                    if(z>0){
                        if(state==0) stv=absv;
                        state++;
                    }else{
                        state--;
                        if(state==0){
                            var gridstz = stv|0;
                            if(gridstz!=gridz){// 在同一个格子内的不管
                                // 起点应该是正的
                                var gridv = stv-gridstz;
                                // 起点
                                coord[ax]=gridstz;
                                data.set(coord[0],coord[1],coord[2],ax,gridv,false);
                                //coord[ax]=gridstz+1;
                                //data.set(coord[0],coord[1],coord[2],ax,gridv-1);//data.set(x,y,gridstz+1,gridv-1);
                                // 填充
                                /*
                                for(var fz=gridstz+2;fz<gridz; fz++){
                                    coord[ax]=fz;
                                    data.set(coord[0],coord[1],coord[2],-127);//data.set(x,y,fz,-127);            
                                }
                                */
                                // 终点. //0到-1分别对应 127~-127
                                // 终点是负的
                                var endv = gridz-absv;// (((absv-gridz)*255)|0)-127;
                                coord[ax]=gridz;
                                data.set(coord[0],coord[1],coord[2],ax,endv,true);
                                //coord[ax]=gridz+1;
                                //data.set(coord[0],coord[1],coord[2],ax,endv+1);  // 至少要提供两个数据
                            }
                        }
                    }
                    //data.set(x,y,gridz,-127);
                }
            }
        }
        //console.log('datanum=',datanum);
    }
}

export class VoxelizeMesh{
    private faceNormal:number[]=[0,0,0,0];  // 法线和d
    private xySurface = new MultiDepthBuffer(2); //每个元素保存的是一个{faceid,dist}
    private yzSurface = new MultiDepthBuffer(0)
    private xzSurface = new MultiDepthBuffer(1);
    private meshMin:number[]=[0,0,0];
    private meshMax:number[]=[0,0,0];
    private gridmin=[0,0,0];
    private gridmax=[0,0,0];

    private posBuffer:Float32Array;
    private _dbgline:PixelLineSprite3D;
    set dbgline(d:PixelLineSprite3D){
        this._dbgline=d;
        dbgline=d;
    }
    get dbgline(){
        return this._dbgline;
    }

    private static tmpNorm = new Vector3();
    private static tmpVec30=new Vector3();
    private static tmpVec31=new Vector3();
    private static nV0=[0,0,0];
    private static nV1=[0,0,0];
    private static nV2=[0,0,0];

    toVoxel(vertices:number[], indices:number[], vertexSize:int, gridsize:number, data:any, flipNormal:boolean){
        var scale = 1/gridsize;
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
			let cx = vertices[vi * vertexSize]*scale;		//x
			let cy = vertices[vi * vertexSize + 1]*scale;	//y;
			let cz = vertices[vi * vertexSize + 2]*scale;	//z
			if(vi==0){
				min[0]=max[0]=cx;
				min[1]=max[1]=cy;
				min[2]=max[2]=cz;
			}else{
				min[0]=Math.min(min[0],cx);min[1]=Math.min(min[1],cy);min[2]=Math.min(min[2],cz);
				max[0]=Math.max(max[0],cx);max[1]=Math.max(max[1],cy);max[2]=Math.max(max[2],cz);
            }
            vertex[vi*3]=cx;
            vertex[vi*3+1]=cy;
            vertex[vi*3+2]=cz;
        }
		let ext = 2;
		min[0]-=ext; min[1]-=ext; min[2]-=ext;
        max[0]+=ext; max[1]+=ext; max[2]+=ext;
        let gridmin = this.gridmin;
        let gridmax = this.gridmax;

        // 转到正区间
        this.transMesh();

        // 计算面法线
        this.calcFaceNormal(flipNormal);

        gridmin[0]=min[0]|0;gridmin[1]=min[1]|0;gridmin[2]=min[2]|0;
        gridmax[0]=max[0]|0;gridmax[1]=max[1]|0;gridmax[2]=max[2]|0;

        var xsize = gridmax[0]-gridmin[0]+1;
        var ysize = gridmax[1]-gridmin[1]+1;
        var zsize = gridmax[2]-gridmin[2]+1;
        // 构造三个平面
        this.xySurface.alloc( xsize, ysize);
        this.xzSurface.alloc( zsize, xsize);
        this.yzSurface.alloc( ysize, zsize);

        var ret = new VoxMesh(this.dbgline);
        ret.init(xsize, ysize, zsize);

        // 遍历所有的三角形，填充三个平面
        this.fill(this.posBuffer,indices,false,ret);

        return {data:ret.data,dims:[xsize,ysize,zsize]};
    }

    private calcFaceNormal(flip:boolean){

    }
    /**
     * 移到正区间。缩放
     */
	private transMesh(){
		let vb = this.posBuffer;
        let min = this.meshMin;
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
			vb[posst] = cx-minx;
			vb[posst+1] = cy-miny;
			vb[posst+2] = cz-minz;
			posst+=3;
		}
    }    

    private fill(vertices:Float32Array, indices:number[], flipNormal:boolean,data:VoxMesh){
        var faceNum = indices.length / 3;
        var fidSt = 0;
        var tri=[0,0,0, 0,0,0, 0,0,0];
        var norm = VoxelizeMesh.tmpNorm;
        for (var fi = 0; fi < faceNum; fi++) {
            var v0id = indices[fidSt++]*3;
            var v1id = indices[fidSt++]*3;
            var v2id = indices[fidSt++]*3;
            //三个顶点的贴图必然一致。只取第一个就行了
            //v0
            tri[0] = vertices[v0id];
            tri[1] = vertices[v0id+1];
            tri[2] = vertices[v0id+2];

            //v1
            tri[3] = vertices[v1id];
            tri[4] = vertices[v1id+1];
            tri[5] = vertices[v1id+2];

            //v2
            tri[6] = vertices[v2id];
            tri[7] = vertices[v2id+1];
            tri[8] = vertices[v2id+2];

            //DEBUG
            //if(fi>480)continue;
            let dbgline = this.dbgline;
            //dbgline.addLine( new Vector3(tri[0],tri[1],tri[2]), new Vector3(tri[3],tri[4],tri[5]), Color.WHITE,Color.WHITE);
            //dbgline.addLine( new Vector3(tri[0],tri[1],tri[2]), new Vector3(tri[6],tri[7],tri[8]), Color.WHITE,Color.WHITE);
            //dbgline.addLine( new Vector3(tri[6],tri[7],tri[8]), new Vector3(tri[3],tri[4],tri[5]), Color.WHITE,Color.WHITE);
            //DEBUG

            // 计算法线
            var e1 = VoxelizeMesh.tmpVec30;
            var e2 = VoxelizeMesh.tmpVec31;
            e1.x = tri[3] - tri[0]; // v1-v0
            e1.y = tri[4] - tri[1];
            e1.z = tri[5] - tri[2];
            e2.x = tri[6] - tri[0]; // v2-v0
            e2.y = tri[7] - tri[1];
            e2.z = tri[8] - tri[2];
            if(flipNormal){
                Vector3.cross(e2, e1, norm);	
            }else{
                Vector3.cross(e1, e2, norm);
            }
            Vector3.normalize(norm,norm);
            if(norm.x==0 && norm.y==0 && norm.z==0)
                continue;            

            let planeD =  norm.x*tri[0]+norm.y*tri[1]+norm.z*tri[2];
            let triplane = this.faceNormal;
            triplane[0]=norm.x; triplane[1]=norm.y; triplane[2]=norm.z; triplane[3]=planeD;

            // 投影，填充
            this.triFillBuffer(tri,norm,planeD);
        }

        // 操作实际数据
        this.xySurface.cleanBuffer(data);
        this.yzSurface.cleanBuffer(data);
        this.xzSurface.cleanBuffer(data);

        data.outPos();

    }

    // TODO 1. 可以控制方向 2. 可以控制误差
    private pointInTriangle(ax:number, ay:number, bx:number, by:number, cx:number, cy:number, px:number, py:number) {
        var a = (cx - px) * (ay - py) - (ax - px) * (cy - py);
        var b =  (ax - px) * (by - py) - (bx - px) * (ay - py);
        var c = (bx - px) * (cy - py) - (cx - px) * (by - py);
        return (a>=0 && b>=0 && c>=0) ||(a<=0&&b<=0&&c<=0);
            // 假设扩展d。则叉乘的值与d的关系与边长成正比
    } 
    
    private triFillBuffer(tri:number[],plane:Vector3, d:number):void{
        // dbg 确认顺序
        var minx = tri[0];
        var miny = tri[1];
        var minz = tri[2];
        var maxx = minx; 
        var maxy = miny;
        var maxz = minz;
        minx>tri[3] && (minx=tri[3]);
        miny>tri[4] && (miny=tri[4]);
        minz>tri[5] && (minz=tri[5]);
        maxx<tri[3] && (maxx=tri[3]);
        maxy<tri[4] && (maxy=tri[4]);
        maxz<tri[5] && (maxz=tri[5]);

        minx>tri[6] && (minx=tri[6]);
        miny>tri[7] && (miny=tri[7]);
        minz>tri[8] && (minz=tri[8]);
        maxx<tri[6] && (maxx=tri[6]);
        maxy<tri[7] && (maxy=tri[7]);
        maxz<tri[8] && (maxz=tri[8]);

        var stx = minx|0;
        var sty = miny|0;
        var stz = minz|0;
        var edx = maxx|0;
        var edy = maxy|0;
        var edz = maxz|0;

        //DEBUG
        let dbgline = this.dbgline;
        //DEBUG

        //console.log('plane:',plane,d);
        var xysurface = this.xySurface;
        if(plane.z<1e-6 && plane.z>-1e-6){
            // 平行了，不会与平面相交
        }else{
            for(var y=sty; y<=edy; y++){
                for(var x=stx; x<=edx; x++){
                    //DEBUG
                    //if(y!=5)continue;
                    //if(x!=8)continue;
                   // if(!xysurface.getdbgFlag(x,y)){
                    //    dbgline.addLine( new Vector3(x,y,0), new Vector3(x,y,40), Color.GREEN,Color.GREEN);
                    //    xysurface.setdbgFlag(x,y);
                    //}
                    //DEBUG
                    // 相当于确定2d的点是否在2d三角形内
                    if(this.pointInTriangle(tri[0],tri[1],tri[3],tri[4],tri[6],tri[7],x,y)){
                        // 计算交点
                        let z = (d -( x*plane.x+y*plane.y))/plane.z;
                        //console.log('dist=',z)
                        if(plane.z>0) z=-z;
                        xysurface.addDepth(x,y,z);
                        //DEBUG
                        //dbgline.addLine(new Vector3(Math.abs(x),Math.abs(y),Math.abs(z)), new Vector3(Math.abs(x),Math.abs(y)+0.1,Math.abs(z)), Color.YELLOW,Color.YELLOW);
                        //DEBUG

                        //DEBUG
                        if(x==7&&y==32){
                            //dbgline.addLine( new Vector3(tri[0],tri[1],tri[2]), new Vector3(tri[3],tri[4],tri[5]), Color.RED, Color.RED);
                            //dbgline.addLine( new Vector3(tri[0],tri[1],tri[2]), new Vector3(tri[6],tri[7],tri[8]), Color.RED, Color.RED);
                            //dbgline.addLine( new Vector3(tri[6],tri[7],tri[8]), new Vector3(tri[3],tri[4],tri[5]), Color.RED, Color.RED);                            
                        }
                        //DEBUG        
                    }
                }
            }
        }

        var xzsurface = this.xzSurface;
        if(plane.y<1e-6 && plane.y>-1e-6){
            // 平行了，不会与平面相交
        }else{
            for( var x=stx; x<=edx; x++){       // y
                for(var z=stz; z<=edz; z++){    // x  因为 2d的x=y+1=z， y=y+2=x
                    // 相当于确定2d的点是否在2d三角形内
                    if(this.pointInTriangle(tri[2],tri[0],tri[5],tri[3],tri[8],tri[6],z,x)){
                        // 计算交点
                        let y = (d -( x*plane.x+z*plane.z))/plane.y;
                        if(plane.y>0)y=-y;
                        xzsurface.addDepth(z,x,y);
                    }
                }
            }
        }

        var yzsurface = this.yzSurface;
        if(plane.x<1e-6 && plane.x>-1e-6){
            // 平行了，不会与平面相交
        }else{
            for(var z=stz; z<=edz; z++){     // y
                for(var y=sty; y<=edy; y++){ // x
                    //DEBUG
                    //if(y!=9)continue;
                    //if(z!=12)continue;
                    //if(!yzsurface.getdbgFlag(y,z)){
                    //    dbgline.addLine( new Vector3(0,y,z), new Vector3(240,y,z), Color.GREEN,Color.GREEN);
                    //    yzsurface.setdbgFlag(y,z);
                    //}
                    //DEBUG                    
                    // 相当于确定2d的点是否在2d三角形内
                    if(this.pointInTriangle(tri[1],tri[2],tri[4],tri[5],tri[7],tri[8],y,z)){// TODO 以后可以优化，不必每次完整计算
                        // 计算交点
                        let x = (d -( z*plane.z+y*plane.y))/plane.x; //TODO 以后可以优化
                        if(plane.x>0)x=-x;
                        yzsurface.addDepth(y,z,x);
                    }
                }
            }
        }
    }
    
    /*
    (cx-px)*(ay-py)-(ax-px)*(cy-py) A
    (cx-px-1)*(ay-py)-(ax-px-1)*(cy-py)
    (cx-px)*(ay-py)-(ay-py)-(ax-px)*(cy-py)+(cy-py)
     = A + (cy-py)-(ay-py) = A+cy-py-ay+py = A+cy-ay
    */
}