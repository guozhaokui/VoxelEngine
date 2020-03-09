import { Vector3 } from 'laya/d3/math/Vector3';
import { PixelLineSprite3D } from "laya/d3/core/pixelLine/PixelLineSprite3D";
import { Color } from 'laya/d3/math/Color';

/**
 * y向上坐标系下顶点和边的id
 * 
 *   Y  
 *   |  
 *     
 *      2 ------3                    .-----5----.
 *     /:      /|                  6/:        7 |
 *    / :     / |                  / 1       /  3
 *   6 ------7  |                 . ---11---.   |
 *   |  0 ---|--1  -->X           |   .---0-|---.  
 *   |  /    | /                  9  /2     10 /4
 *   | /     |/                   | /       | /
 *   4 ------5                    . ---8----.
 *  / 
 * Z
 * 
 */

 var dbgline:PixelLineSprite3D;

export class VoxMesh{
    private xsize=0;
    private ysize=0;
    private zsize=0;
    /** 投影到xy的数据  */
    data:number[/* x,y */][/* 层 */][/* x,y,z距离 */]=[];
    private posData:number[/*x,y*/][/*pos,inner*/]=[];
    /** 保存两层的边相交数据，每个保存的是[x,y,z] */
    private static rtBuff:number[][]=[[],[]];

    /** tomesh的时候用来局部展开记录顶点索引的。用ArrayBuffer是为了操作方便 */
    //private static toMeshRtBuf:ArrayBuffer|null;// number[/*层*/][/*xy 对应的顶点索引*/]=[[/*第0层*/],[/*第一层*/]];
    /** 实际操作上面的buffer */
    //static toMeshRtU32Buff:Uint32Array[];   

   	/** cube的12条边，按照顶点顺序+三个正方向 */
	static cube_edges = [0, 1,   0, 2,   0, 4,   1, 3, 1, 5,  2, 3, 2, 6,  3, 7, 4, 5, 4, 6, 5, 7, 6, 7];
	/** 不同组合下的边表，一共2^8=256种 */
    static edge_table = new Int32Array(256);

    /** 每条边上的交点所在方向 */
    static edge_pos=[
          0,  // 0,x 距离格子原点0,0,0 使用x轴的交点
          1,  //1 y
          2,  //2 z
          1,  //3 y
          2,  //4 z
          0,  //5 x
          2,  //6 z
          2,  //7 z
          0,  //8 x
          1,  //9 y
          1,  //10 y
          0   //11 x
         ];

    static init_table=false;

    static initTable(){
        var edge_table = VoxMesh.edge_table;
        var cube_edges = VoxMesh.cube_edges;
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

    constructor(line:PixelLineSprite3D){
        dbgline=line;
    }

    init(xs:int,ys:int,zs:int){
        if(!VoxMesh.init_table){
            VoxMesh.init_table=true;
            VoxMesh.initTable();
        }

        this.xsize=xs;
        this.ysize=ys;
        this.zsize=zs;
        this.data.length=xs*ys;
        var dt = this.data;
        var id=0;
        for(var y=0;y<ys; y++){
            for(var x=0; x<xs; x++,id++){
                dt[id]=[];
            }
        }

        var rtbuff = VoxMesh.rtBuff;
        rtbuff[0].length = xs*ys*3;  //TODO 用+1么
        rtbuff[1].length = xs*ys*3;

        var posData = this.posData;
        posData.length=xs*ys;
        id=0;
        for(var y=0;y<ys; y++){
            for(var x=0; x<xs; x++,id++){
                posData[id]=[];
            }
        }
    }

    /**
     * 
     * @param x 
     * @param y 
     * @param z 
     * @param dir 0 x轴，1 y轴 2 z轴
     * @param d  相对值，-1到1之间
     * @param inner 外部提供，更准确，也能区分-0
     */
    set(x:int,y:int,z:int,dir:int,d:number, inner:boolean){
        var zline = this.data[x+this.xsize*y];
        /* 以后再做，比较效率和内存
        var dl = zline.length;
        for(var i=0; i<dl; i++){
            var griddata = zline[i]
            if(griddata[0])
        }
        */
        var zdt = zline[z];
        if(!zdt){
            zdt = zline[z]=[-10,-10,-10,inner?1:0];
        }
        zdt[dir]=d;
    }

    /**
     * 这个函数比较低效，尽量避免使用
     * @param x 
     * @param y 
     * @param z 
     */
     get(x:int,y:int,z:int){
        var zline = this.data[x+this.xsize*y];
        if(!zline)return null;
        var zdt = zline[z];
        if(!zdt){
            return null;
        }
        return zdt;
    }

    expLayer(i:int){
        var xs = this.zsize;
        var ys = this.ysize;
        var dt = this.data;
        var layer = i%2;
        var buff = VoxMesh.rtBuff[layer];
        var id=0;
        for(var y=0;y<ys-1; y++){
            for(var x=0; x<xs-1; x++,id++){
                var zline = dt[id];
                var zlen = zline.length;
                if(zlen){
                    // 找到当前层的数据填入。由于现在是用下标访问，先不做这个，以后改成连续数组再做
                }
            }
        }
    }

    outPos(){
        var xs = this.xsize;
        var ys = this.ysize;
        var dt = this.data;
        var NOD=-10;
        //DEBUG
        var dbg=false;
        //DEBUG

        /** 顶点 */
        var  vert = [0.0, 0.0, 0.0];
        for(var y=0;y<ys-1; y++){
            for(var x=0; x<xs-1; x++){
                //DEBUG
                dbg = x==7&&y==5;
                if(x==7&&y==5){
                    //debugger;
                }
                //DEBUG
                var id=x+y*xs;
                var zline = dt[id];
                var zlen = zline.length;
                // 必须要考虑旁边的影响，比如只有7点有变化，则这个点也要设置shape
                zlen = Math.max(zlen, dt[id + 1].length, dt[id + xs].length);                
                var scanInner = false;
                if(zlen){
                    for(var z=0; z<zlen; z++){
                        //DEBUG
                        if(dbg && z==3){
                            debugger;
                        }
                        //DEBUG
                        // 当前格子的任意一条边有数据，就要计算
                        var p1 = dt[x+1+xs*y];//TODO xs*y 优化
                        var p2 = dt[x+xs*(y+1)];
                        var p3 = dt[x+1+xs*(y+1)];

                        var v0 = zline[z];
                        var v1 = p1 && p1[z];
                        var v2 = p2 && p2[z];
                        var v3 = p3 && p3[z];
                        var v4 = zline[z+1];
                        var v5= p1 && p1[z+1];
                        var v6= p2 && p2[z+1];

                        if (v0) {
                            if (!scanInner && v0[2]!=NOD && v0[3] == 0) {// 必须是z有数据
                                scanInner = true;
                            }
                            if (scanInner &&  v0[2]!=NOD && v0[3] == 1) {
                                scanInner = false;
                            }
                        }else {
                            if (scanInner) {
                                // 填充内部
                                this.fill(x,y,z,-2)
                                //cubedata.set1x1x1(x, y, z, color);
                            }
                        }

                        vert[0]=vert[1]=vert[2]=0;

                        var inner =0;  // inner只能根据v0来判断，不必考虑其他点，否则会得到错误（矛盾）的结论
                        // 下面统计12条边的切割情况
                        /** 有交点的边的个数 */
                        var  e_count = 0;
                        if(v0){
                            if(v0[0]!=NOD){
                                vert[0]+=Math.abs(v0[0]);
                                e_count++;
                            }
                            if(v0[1]!=NOD){
                                vert[1]+=Math.abs(v0[1]);
                                e_count++;
                            }
                            if(v0[2]!=NOD){
                                vert[2]+=Math.abs(v0[2]);
                                e_count++;
                            }
                            inner = v0[3];
                        }else{
                            inner = scanInner?1:0;
                        }

                        if(v1){
                            if(v1[1]!=NOD){
                                vert[0]+=1;
                                vert[1]+=Math.abs(v1[1]);
                                e_count++;
                            }

                            if(v1[2]!=NOD){
                                vert[0]+=1;
                                vert[2]+=Math.abs(v1[2]);
                                e_count++;
                            }
                        }

                        if(v2){
                            if(v2[0]!=NOD){
                                vert[1]+=1;
                                vert[0]+=Math.abs(v2[0]);
                                e_count++;
                            }

                            if(v2[2]!=NOD){
                                vert[1]+=1;
                                vert[2]+=Math.abs(v2[2]);
                                e_count++;
                            }
                        }

                        if(v3){
                            if(v3[2]!=NOD){
                                vert[0]+=1;
                                vert[1]+=1;
                                vert[2]+=Math.abs(v3[2]);
                                e_count++;
                            }
                        }

                        if(v4){
                            if(v4[0]!=NOD){
                                vert[2]+=1;
                                vert[0]+=Math.abs(v4[0]);
                                e_count++;
                            }
                            if(v4[1]!=NOD){
                                vert[2]+=1;
                                vert[1]+=Math.abs(v4[1]);
                                e_count++;
                            }
                        }

                        if(v5){
                            if(v5[1]!=NOD){
                                vert[0]+=1;
                                vert[2]+=1;
                                vert[1]+=Math.abs(v5[1]);
                                e_count++;
                            }
                        }
                        if(v6){
                            if(v6[0]!=NOD){
                                vert[1]+=1; //y
                                vert[2]+=1; //z
                                vert[0]+=Math.abs(v6[0]);
                                e_count++;
                            }
                        }

                        // 计算平均值
                        if(e_count>0){
                            //DEBUG
                            if(dbg){
                                console.log('xyz',x,y,z);
                            }
                            //DEBUG
                            var s = 1/e_count;
                            vert[0]*=s;
                            vert[1]*=s;
                            vert[2]*=s;
                            this.setVertex(x,y,z,vert,inner);
                        }else{
                            //debugger;
                        }
                    }
                }
            }
        }
    }

    setVertex(x:int,y:int,z:int, pos:number[],inner:int){
        //DEBUG
        var cpos = new Vector3(x+pos[0],y+pos[1],z+pos[2]);
        dbgline.addLine(cpos, new Vector3(cpos.x+0.1,cpos.y,cpos.z),Color.WHITE,Color.WHITE);
        //DEBUG
        var fx = pos[0];
        var fy = pos[1];
        var fz = pos[2];
        if(fx>1)fx=1; if(fx<0)fx=0;
        if(fy>1)fy=1; if(fy<0)fy=0;
        if(fz>1)fz=1; if(fz<0)fz=0;
        var intv = ((fx*0xff)<<24) +
                ((fy*0xff)<<16)+
                ((fz*0xff)<<8)+
                inner;

        if(intv==0){
            // x,y,z的值都很小，又是外部，就会变成0,0是表示非shape的，所以要避免
            intv=1<<8;
        }    
        this.posData[x+y*this.xsize][z]=intv;
    }    

    fill(x:int,y:int,z:int,dist:number){

    }

    toMesh(){
        var xs = this.xsize;
        var ys = this.ysize;
        var zs = this.zsize;

		var vertices:number[][] = [];
		var faces:number[][] = [];

        var posData = this.posData;
        /** 从第0层开始，这一层只可能出现上下的变化，因此取的index都是本层的，是没有问题的 */
        var posRTBuff = /*VoxMesh.toMeshRtBuf =*/ new ArrayBuffer(xs*ys*4*2);  // 由于索引的局部性，其实不需要这么大的buffer
        var posRTU32Buff = new Uint32Array(posRTBuff);
        var posRTU32Buffs:Uint32Array[] = [ new Uint32Array(posRTBuff,0,xs*ys), new Uint32Array(posRTBuff,xs*ys*4,xs*ys) ];

        var clayer = 1; // 开始写第一层，这样还有个0层保护，第二次写0层

        var grid:number[] = [];
        var mask=0;
        var edge_table = VoxMesh.edge_table;
        var dz = xs*ys;

        var adjDist:number[]=[1,xs,xs*ys];

        /** 这个是为了方便用数组访问 */
        var cpos:number[]=[0,0,0];

        for(var z=0; z<zs; z++,clayer^=1,adjDist[2]=-adjDist[2] ){
            cpos[2]=z;
            for(var y=0;y<ys; y++){
                cpos[1]=y;
                for(var x=0; x<xs; x++){
                    cpos[0]=x;
                    var p1 = x+y*xs; 
                    var zline = posData[p1];
                    //var zlen = zline.length;
                    //for(var z=0; z<zlen; z++){
                    var cz = zline[z];
                    if(!cz)continue;
                    var inner = cz&0xff;
                    if(inner) mask=1;
                    var px = x +((cz >>> 24) & 0xff) / 0xff;
                    var py = y +((cz >>> 16) & 0xff) / 0xff;
                    var pz = z +((cz >>> 8) & 0xff) / 0xff;
                    var inner = cz&0xff;
                    var pxdt = posData[p1+1];
                    var pydt = posData[p1+xs];
                    
                    var px = pxdt? (pxdt[z]&0xff):0;
                    var py = pydt? (pydt[z]&0xff):0;
                    var pz = zline[z+1]&0xff;

                    if(inner!=px){

                    }
                    if(inner!=py){

                    }
                    if(inner!=pz){
                        
                    }
                    
                    // 确定8个点的inner
                    throw 'NI';


                    if(mask===0||mask===0xff){
                        debugger;
                        continue;
                    }
                    // mask
                    var edge_mask = edge_table[mask];

                    // 如果任意边有变化，则需要添加
                    vertices.push([x+px,y+py,z+pz]);
                    var m = p1;
                    posRTU32Buffs[clayer][m]=vertices.length;

                    // 根据变化的方向确定索引
					for (var i = 0; i < 3; ++i) {
						if (!(edge_mask & (1 << i))) {
							// 如果当前方向边没有交点，则不必处理
							continue;
						}

						// i = axes we are point along.  iu, iv = orthogonal axes
						var iu = (i + 1) % 3
							, iv = (i + 2) % 3;

						// 在边界上，由于需要前一个数据，所以不能处理边界。而i的边界没有问题，因为需要的数据都在同层
						if (cpos[iu] === 0 || cpos[iv] === 0) {
							continue;
						}

						//Otherwise, look up adjacent edges in buffer
						var du = adjDist[iu]
							, dv = adjDist[iv];

                        // 连接相邻四个点。
                        m = p1+clayer*dz;
						if (mask & 1) {
							// 如果当前cube在内部
							faces.push([posRTU32Buff[m], posRTU32Buff[m - dv], posRTU32Buff[m - du - dv], posRTU32Buff[m - du]]);
						} else {
							faces.push([posRTU32Buff[m], posRTU32Buff[m - du], posRTU32Buff[m - du - dv], posRTU32Buff[m - dv]]);
                        }
                    }
                }
            }
        }

        //VoxMesh.toMeshRtBuf=null;

        return { vertices: vertices, faces: faces };
    }    
}
