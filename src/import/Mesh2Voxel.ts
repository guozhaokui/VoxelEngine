import { VoxTriangleFiller } from "./VoxTriangleFiller";
import { Laya } from "Laya";
import { Handler } from "laya/utils/Handler";
import { OBJLoader_mesh, OBJLoader_Material } from "../loader/objloader/ObjectFile";
import { Texture2D } from "laya/resource/Texture2D";

export class Mesh2Voxel{
	trifiller=new VoxTriangleFiller();
	objmtl:OBJLoader_Material|null=null;
	meshMin=[0,0,0];
	meshMax=[0,0,0];
	posBuffer:Float32Array;
	faceBuffer:number[];

    loadObj(url: string,gridsz:number): void {
        Laya.loader.load(url, new Handler(this, (data:string)=>{
			let dt = this.voxelizeObjMesh(data,gridsz);
			debugger;
			/*
            let xn=this.gridXSize; let yn=this.gridYSize; let zn = this.gridZSize;
            let min=new Vec3(this.minx,this.miny,this.minz);
            let max=new Vec3(xn,yn,zn);
            min.addScaledVector(this.gridSize,max,max);
            let ret = new SparseVoxData(dt,xn,yn,zn,min,max);
			cb && cb(ret);
			*/
        }));
	}
	
    onLoadMtl(mtlstr:string):void{
    }
    
    parseObjMtl(mtlstr:string):OBJLoader_Material{
        var objmtl = this.objmtl = new OBJLoader_Material('root');
        objmtl.parse(mtlstr);
        return objmtl;
	}
	
    /**
     * 
     * @param data 
     * @param sz 小格子大小
     */
    voxelizeObjMesh(data:string, sz:number){
        // 加载obj文件
        var objmesh = new OBJLoader_mesh(data, null);
        // 所有的顶点，index，texture
        let verteices = objmesh.vertices;
        let textures = objmesh.textures;
        var vertnum = verteices.length / 3;
        var uvnum = textures.length / 2;
        let objmtl = this.objmtl;
        if (objmtl && vertnum != uvnum) 
            console.error('pos vertext num!=uv vertex num');
        //var mtls: Texture[] = [];
		var vertex = this.posBuffer = new Float32Array(vertnum*3);
		this.faceBuffer = objmesh.indices;	//用复制么
		var cfi=0;
		let min = this.meshMin;
		let max = this.meshMax;
        for (var vi = 0; vi < vertnum; vi++) {
            var tex: Texture2D | null = null;
            var mtlid = objmesh.vertexMaterialIndices[vi];  // 当前点的材质索引
            var mtlname = objmesh.materialNames[mtlid];     // 当前材质名称
            var mtl = objmtl && objmtl.materials[mtlname];
            if (mtl && mtl.mapDiffuse && mtl.mapDiffuse.filename) {
                tex = Laya.loader.getRes(mtl.mapDiffuse.filename);
			}
			let cx = verteices[vi * 3];		//x
			let cy = verteices[vi * 3 + 1];	//y;
			let cz = verteices[vi * 3 + 2];	//z
			if(vi==0){
				min[0]=max[0]=cx;
				min[1]=max[1]=cy;
				min[2]=max[2]=cz;
			}else{
				min[0]=Math.min(min[0],cx);min[1]=Math.min(min[1],cy);min[2]=Math.min(min[2],cz);
				max[0]=Math.max(max[0],cx);max[1]=Math.max(max[1],cy);max[2]=Math.max(max[2],cz);
			}
			vertex[cfi++]=cx;
			vertex[cfi++]=cy;
			vertex[cfi++]=cz;
		}
		
		console.log(min,max);

		this.transMesh();

        var ret = this.renderToVoxel(sz);
        return ret;
    }	

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
			vb[posst+1] = cz-minz;
			vb[posst+2] = cy-miny;
			posst+=3;
		}
	}
	/**
	 * 
	 * @param vb 
	 * @param vertexStride float的个数
	 * @param ib 
	 * @param gridSize 
	 */
	renderToVoxel(gridSize:number) {
		var trifiller = this.trifiller;
		var faceIndex = this.faceBuffer;
		var vertexArray = this.posBuffer;
		var faceNum = faceIndex.length / 3;
		var fidSt = 0;

		var miny=1000;
		var maxy=-1000;
		trifiller.gridsz = gridSize;
		for (var fi = 0; fi < faceNum; fi++) {
			var v0id = faceIndex[fidSt++]*3;
			var v1id = faceIndex[fidSt++]*3;
			var v2id = faceIndex[fidSt++]*3;

			//三个顶点的贴图必然一致。只取第一个就行了
			trifiller.v0[0] = vertexArray[v0id];
			trifiller.v0[1] = vertexArray[v0id+1];
			trifiller.v0[2] = vertexArray[v0id+2];

			trifiller.v1[0] = vertexArray[v1id];
			trifiller.v1[1] = vertexArray[v1id+1];
			trifiller.v1[2] = vertexArray[v1id+2];

			trifiller.v2[0] = vertexArray[v2id];
			trifiller.v2[1] = vertexArray[v2id+1];
			trifiller.v2[2] = vertexArray[v2id+2];

			trifiller.fill(function(x:number, y:number, z:number):void{
				x = Math.round(x);
				y = Math.round(y);
				z = Math.round(z);
				if(y<miny)miny=y;
				if(y>maxy)maxy=y;
			});
		}
		console.log(miny,maxy);
	}

	private fill(){

	}
}