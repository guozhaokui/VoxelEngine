import { Scene3D } from 'laya/d3/core/scene/Scene3D';
import { VoxTriangleFiller } from "./VoxTriangleFiller";
import { Laya } from "Laya";
import { Handler } from "laya/utils/Handler";
import { OBJLoader_mesh, OBJLoader_Material } from "../loader/objloader/ObjectFile";
import { Texture2D } from "laya/resource/Texture2D";
import { SurfaceNets } from "../SurfaceNets";
import { polyToTriMesh } from "../Mesh";
import { MeshSprite3D } from "laya/d3/core/MeshSprite3D";
import { VoxelizeMesh } from './VoxelizeMesh';
import { PixelLineSprite3D } from 'laya/d3/core/pixelLine/PixelLineSprite3D';

function smoothMesh(vertices:number[][], indices:number[][]){
	let fi=0;
	let smoothR = 10;
	for(fi=0; fi<indices.length; fi++){

	}
}

export class Mesh2Voxel{
	trifiller=new VoxTriangleFiller();
	objmtl:OBJLoader_Material|null=null;
	meshMin=[0,0,0];
	meshMax=[0,0,0];
	posBuffer:Float32Array;
	faceBuffer:number[];

	dbgline:PixelLineSprite3D;

    loadObj(url: string,gridsz:number,scene:Scene3D): void {
        Laya.loader.load(url, new Handler(this, (data:string)=>{
			var objmesh = new OBJLoader_mesh(data, null);

			var newvox = new  VoxelizeMesh();
			newvox.dbgline=this.dbgline;
			console.time('ToVox');
			var dt = newvox.toVoxel(objmesh.vertices,objmesh.indices,3,gridsz,null,false);
			console.timeEnd('ToVox');
			/*
			let dt = this.voxelizeObjMesh(objmesh,gridsz);
			*/
			let isos = new SurfaceNets();
			//TEST
			/*
			dt.data = new Int8Array(3**3);
			dt.data.fill(5);
			dt.data[13]=-5;
			dt.dims=[3,3,3]
			*/
			//TEST
			let mesh1 = isos.tomesh(dt.data,dt.dims);
			
			let meshes = polyToTriMesh(mesh1.vertices,mesh1.faces);
			meshes.forEach( mesh=>{
				let cmesh = new MeshSprite3D(mesh);
				scene.addChild(cmesh);
			});
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
    voxelizeObjMesh(objmesh:any, sz:number){
        // 加载obj文件
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
		
		let ext = 2*sz;
		min[0]-=ext; min[1]-=ext; min[2]-=ext;
		max[0]+=ext; max[1]+=ext; max[2]+=ext;


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
			vb[posst+2] = cz-minz;
			vb[posst+1] = cy-miny;
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
		let scale = 1/gridSize;			// 为了格子化全部是1，这里用缩放的方法
		var trifiller = this.trifiller;
		var faceIndex = this.faceBuffer;
		var vertexArray = this.posBuffer;
		var faceNum = faceIndex.length / 3;

		let dx = this.meshMax[0]-this.meshMin[0];
		let dy = this.meshMax[1]-this.meshMin[1];
		let dz = this.meshMax[2]-this.meshMin[2];
		let dxs =Math.ceil( dx*scale);
		let dys =Math.ceil(dy*scale);
		let dzs = Math.ceil(dz*scale);
		let sz = dxs*dys*dzs;
		let ydist=dxs;
		let zdist =dxs*dys;
		let ret = new Int8Array(sz);
		ret.fill(127);

		var fidSt = 0;
		for (var fi = 0; fi < faceNum; fi++) {
			var v0id = faceIndex[fidSt++]*3;
			var v1id = faceIndex[fidSt++]*3;
			var v2id = faceIndex[fidSt++]*3;

			//三个顶点的贴图必然一致。只取第一个就行了
			trifiller.v0[0] = vertexArray[v0id]*scale;
			trifiller.v0[1] = vertexArray[v0id+1]*scale;
			trifiller.v0[2] = vertexArray[v0id+2]*scale;

			trifiller.v1[0] = vertexArray[v1id]*scale;
			trifiller.v1[1] = vertexArray[v1id+1]*scale;
			trifiller.v1[2] = vertexArray[v1id+2]*scale;

			trifiller.v2[0] = vertexArray[v2id]*scale;
			trifiller.v2[1] = vertexArray[v2id+1]*scale;
			trifiller.v2[2] = vertexArray[v2id+2]*scale;

			trifiller.fill(function(x:number, y:number, z:number,dist:number):void{
				x = Math.round(x);
				y = Math.round(y);
				z = Math.round(z);
				let pos = x+y*ydist+z*zdist;
				dist = Math.round(dist*127);
				if(dist>127)dist=127;
				if(dist<-127)dist=-127;
				// 单个片组成模型相当于取交集。交集就是取大的
				if(ret[pos]==127)ret[pos]=dist;
				else{
					ret[pos]=Math.max(ret[pos],dist);
				} if(ret[pos]<dist) ret[pos]=dist;
			});
		}
		console.log('voxsize:',dxs,dys,dzs);
		//this.fill(ret,[dxs,dys,dzs])
		return {data:ret,dims:[dxs,dys,dzs]};
	}

	private fill(data:Int8Array, dims:number[]){
		let xl = dims[0];
		let yl = dims[1];
		let zl = dims[2];
		let ydist=xl;
		let zdist=xl*yl;
		let lastd = 1;
		for(let z=0; z<zl; z++){
			for(let y=0; y<yl; y++){
				lastd=1;
				for(let x=0;x<xl; x++){
					let d = data[x+y*ydist+z*zdist];
					if(d==127){
						if(lastd<0)
							data[x+y*ydist+z*zdist]=lastd;
					}else{
						lastd=d;
					}
				}
			}
		}
	}
}