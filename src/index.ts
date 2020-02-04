import { Sprite3D } from "laya/d3/core/Sprite3D";
import { Scene3D } from "laya/d3/core/scene/Scene3D";
import { Laya } from "Laya";
import { Laya3D } from "Laya3D";
import { MeshSprite3D } from "laya/d3/core/MeshSprite3D";
import { createVoxMesh, polyToTriMesh } from "./Mesh";
import { Vector3 } from "laya/d3/math/Vector3";
import { BlinnPhongMaterial } from "laya/d3/core/material/BlinnPhongMaterial";
import { Camera } from "laya/d3/core/Camera";
import { MouseCtrl1 } from "./ctrls/MouseCtrl1";
import { Vector4 } from "laya/d3/math/Vector4";
import { DirectionLight } from "laya/d3/core/light/DirectionLight";
import { genVoxData, SphereData, Sine_Waves, Terrain, Perlin_Noise } from "./datagen/TestData";
import { SurfaceNets } from "./SurfaceNets";
import { GridSurface } from "./editor/gridSurface";
import { Quaternion } from "laya/d3/math/Quaternion";
import { MarchingCubes } from "./MarchingCubes";
import { SurfaceNetSmoother } from "./SurfaceNetSmoother";
import { RenderState } from "laya/d3/core/material/RenderState";
import { delay } from "./Async";
import { download } from "./loader/Async";
import { SimplifyMesh } from "./SimplifyMesh";
import { VertexMesh } from "laya/d3/graphics/Vertex/VertexMesh";
import { PrimitiveMesh } from "laya/d3/resource/models/PrimitiveMesh";
import { Mesh } from "laya/d3/resource/models/Mesh";
import { Mesh2Voxel } from "./import/Mesh2Voxel";

//
let scene: Scene3D;
//let mtl1:BlinnPhongMaterial;
Laya3D.init(window.innerWidth, window.innerHeight);
scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
let mtl2 = new BlinnPhongMaterial();

var camera = (<Camera>scene.addChild(new Camera(0, 1, 10000)));
//camera.transform.translate(new Vector3(0, 0, 6));
//camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
let camctrl = camera.addComponent(MouseCtrl1) as MouseCtrl1;
camera.clearColor = new Vector4(0.2, 0.2, 0.2, 0);
camctrl.initCamera(new Vector3(0, 20, 0), new Vector3(0, 0, 0), 132);
//camera.addComponent(CameraMoveScript);
//camera.clearColor = null;

//light
var directionLight = (<DirectionLight>scene.addChild(new DirectionLight()));
directionLight.color = new Vector3(0.6, 0.6, 0.6);
//设置平行光的方向
var mat = directionLight.transform.worldMatrix;
mat.setForward(new Vector3(-1.0, -1.0, 1.0));
directionLight.transform.worldMatrix = mat;

let grid = new GridSurface(10, null, null);
//grid.showAxis=false;
grid.addToScene(scene);


let mv = new Mesh2Voxel();
mv.loadObj('res/volumeBody.obj',0.01);


//let mesh = new MeshSprite3D(createVoxMesh({get:getdata},10,10,10,10,10,10,new Vector3(0,0,0), new Vector3(10,10,10)));
//scene.addChild(mesh);
//mesh.transform.localPosition = new Vector3(-5,-5,-5)
let sidelen = 44;
//let data = SphereData(-2,2,sidelen);
let data = SphereData(-2, 2, sidelen);

modifydata_snap(data.data,data.dims);
modifydata_smooth(data.data,data.dims);
modifydata_smooth(data.data,data.dims);
modifydata_smooth(data.data,data.dims);

let isos = new SurfaceNets();
let mesh1 = isos.tomesh(data.data,data.dims);

let meshes = polyToTriMesh(mesh1.vertices,mesh1.faces);
meshes.forEach( mesh=>{
	let cmesh = new MeshSprite3D(mesh);
	scene.addChild(cmesh);
});


function modifydata_snap(data:Float32Array,dims:number[]){
	let i=0;
	for(let z= 0; z<dims[2]; z++){
		for(let y=0; y<dims[1]; y++){
			for(let x=0; x<dims[0];x++,i++){
				if(data[i]<0){
					data[i]=-0.5;
				}else if(data[i]>0){
					data[i]=0.5;
				}
			}
		}
	}
}

function modifydata_smooth(data:Float32Array,dims:number[]){
	let disty=dims[0];
	let distz=dims[0]*dims[1];
	function getData(x:int,y:int,z:int){
		return data[x+y*disty+z*distz];
	}
	for(let z= 1; z<20-1; z++){
		for(let y=1; y<dims[1]-1; y++){
			for(let x=1; x<dims[0]-1;x++){
				data[x+y*disty+z*distz]=(
				getData(x,y+1,z)+getData(x+1,y+1,z)+getData(x-1,y+1,z)+
				getData(x,y,z)+getData(x+1,y,z)+getData(x-1,y,z)+
				getData(x,y-1,z)+getData(x+1,y-1,z)+getData(x-1,y-1,z)+

				getData(x,y+1,z-1)+getData(x+1,y+1,z-1)+getData(x-1,y+1,z-1)+
				getData(x,y,z-1)+getData(x+1,y,z-1)+getData(x-1,y,z-1)+
				getData(x,y-1,z-1)+getData(x+1,y-1,z-1)+getData(x-1,y-1,z-1)+

				getData(x,y+1,z+1)+getData(x+1,y+1,z+1)+getData(x-1,y+1,z+1)+
				getData(x,y,z+1)+getData(x+1,y,z+1)+getData(x-1,y,z+1)+
				getData(x,y-1,z+1)+getData(x+1,y-1,z+1)+getData(x-1,y-1,z+1))/27;
			}
		}
	}
}

//test data

class voxdata{
	size:int=1;
	data:Float32Array;
	dims:number[];
	private distZ:number;
	private distY:number;
	private cx=0;
	private cy=0;
	private cz=0;
	constructor(s:int){
		this.size=s;
		this.data = new Float32Array(s**3);
		this.dims=[s,s,s];
		this.distZ=s;
		this.distY=s*s;
	}

	set(x:int,y:int,z:int,v=1){
		this.data[x+y*this.distY+z*this.distZ]=v;
	}

	to(x:int,y:int,z:int,b:boolean){
		this.cx=x;
		this.cy=y;
		this.cz=z;
		b&&this.s();
		return this;
	}
	s(){
		this.set(this.cx,this.cy,this.cz);
	}
	px(){ this.cx++; this.s(); return this;}
	py(){ this.cy++; this.s(); return this;}
	pz(){ this.cz++; this.s(); return this;}

	fillbox(x0:int,y0:int,z0:int, x1:int,y1:int,z1:int, v=1){
		for(let y=y0; y<y1; y++){
			for(let z=z0; z<z1; z++){
				for(let x=x0; x<x1;x++){
					this.set(x,y,z,v);
				}
			}
		}
	}

	fill(v:number){
		this.data.fill(v);
	}
}

var perfdata:number[]=[];
function testPerf(dt:{vb:number[], ib:number[]},it:int){
	let sm= new SimplifyMesh();
	let st = Date.now();
	//console.time('simplifymesh');
	//console.time('simp init');
	sm.init(new Float32Array(dt.vb), new Uint16Array(dt.ib));
	//sm.simplify_mesh(2936);
	//console.timeEnd('simp init');
	//console.time('simp simplify_mesh');
	sm.simplify_mesh(100);
	//console.timeEnd('simp simplify_mesh');
	//console.time('simp tomesh');
	var obj = sm.genMesh();
	//console.timeEnd('simp tomesh');
	//console.timeEnd('simplifymesh');
	let tm = Date.now()-st;
	perfdata.push(it,tm);
	return obj;
}

async function testSimplifyMesh(){
	let dt:{vb:number[], ib:number[]}= await download('res/peiqiMesh.json');
	/*
	for(let i=0; i<4; i++){
		testPerf(dt,i);
	}
	console.log(perfdata);
	*/
	let obj = testPerf(dt,0);
	var vertDecl = VertexMesh.getVertexDeclaration("POSITION,NORMAL,COLOR");
	let cmesh = new MeshSprite3D((PrimitiveMesh as any)._createMesh(vertDecl, obj.vb, obj.ib) as Mesh);
	var mtl = new BlinnPhongMaterial();
	cmesh.meshRenderer.sharedMaterial = mtl;
	mtl.enableVertexColor=true;
	scene.addChild(cmesh);
}

async function main() {
	//await testSimplifyMesh();

	let s = 150;
	let vox = new voxdata(s);
	let distZ = s;
	let distY = s * s;
	let data = vox.data;
	vox.fill(-1);

	// 球
	///*
	let c=(s/2)|0
	for(let z=0; z<s; z++){
		for(let y=0; y<s; y++){
			for(let x=0; x<s; x++){
				let dx = x-c; dx/=31;
				let dy = y-c; dy/=31;
				let dz = z-c; dz/=31;
				let r = Math.sqrt(dx*dx+dy*dy+dz*dz)-1;
				if(r<0)r=1;
				else r=-1;
				data[x+y*distY+z*distZ] = r;
			}
		}
	}
	//*/
	// 盒子
	/*
	for (let z = 2; z < 40; z++) {
		for (let y = 2; y < 40; y++) {
			for (let x = 2; x < 40; x++) {
				vox.data[x + y * distY + z * distZ] = 1;
				if (z == 39) {
					data[x + y * distY + z * distZ] = 1 + Math.random();
				}
			}
		}
	}
	*/

	// 测试形状
	//test data end
	let ss = 110;
	switch(ss){
		case 0:
			vox.to(2,2,2,true);
			break;
		case 100:
			vox.fillbox(2,2,2,4,4,4);
			break;
		case 1:
			vox.to(2,2,5,true).px().px();
			vox.to(2,2,4,true).px().px();
			vox.to(2,3,4,true).px().px();
		break;
		case 2:
			vox.to(2,2,2,true).pz().pz();
			vox.to(3,2,2,true).pz().pz();
			vox.to(3,3,2,true).pz().pz();
		break;
		case 3:
			vox.to(3,2,2,true).py().py();
			vox.to(2,2,3,true).py().py();
			vox.to(3,2,3,true).py().py();
		break;
		case 4:
			vox.to(3,2,2,true).py().py();
			vox.to(3,2,3,true).py().py();
			vox.to(4,2,3,true).py().py();
		break;
		case 5:
			vox.to(3,2,2,true).py().py();
			vox.to(4,2,3,true).py().py();
		break;
		case 6:
			vox.to(2,2,2,true);
			vox.to(3,2,2,true).py();
			vox.to(3,2,3,true);
			break;
		case 7:
			vox.fillbox(2,2,2,4,4,4,1);
			vox.fillbox(3,3,3,4,4,4,-1);
			break;
		case 8:
			vox.fillbox(2,2,2,4,4,4,1);
			vox.fillbox(3,2,2,4,3,3,-1);
			break;
		case 9:
			vox.to(2,2,2,true);
			vox.to(3,2,2,true).py();
			vox.to(4,2,2,true).py().py();
			vox.to(3,2,3,true);
			vox.to(4,2,3,true).py();
			vox.to(4,2,4,true);
			break;
		case 10:
			vox.fillbox(2,2,2,6,5,5,1);
			vox.fillbox(2,5,2,6,6,4,1);
			break;
	}


	let m2 = new SurfaceNetSmoother();
	//m2.loadSurfaceNet('res/peiqi.json');
	m2.createSurfaceNet(vox.data, vox.dims);
	m2.relaxSurfaceNet(11);

	var mtl = new BlinnPhongMaterial();
	//mtl.cull = RenderState.CULL_NONE;
	mtl.blend = RenderState.BLEND_ENABLE_ALL;
	mtl.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
	mtl.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
	mtl.depthTest = RenderState.DEPTHTEST_LESS;

	if(false){
		let rmeshes:MeshSprite3D[]=[];
		for(let i=0; i<10; i++){
			m2.relaxSurfaceNet(1);
			let meshes = m2.toMeshes();
			meshes.forEach(mesh => {
				let cmesh = new MeshSprite3D(mesh);
				cmesh.meshRenderer.sharedMaterial = mtl;
				rmeshes.push(cmesh);
				scene.addChild(cmesh);
				let c = cmesh.meshRenderer.bounds.getCenter();
				//cmesh.transform.localPosition = new Vector3(-c.x, -c.y, -c.z)
			});

			await delay(200);
			rmeshes.forEach( m=>{
				scene.removeChild(m);
				m.destroy();
			});
			rmeshes.length=0;
		}
	}

	let meshes = m2.toMeshes();
	meshes.forEach(mesh => {
		let cmesh = new MeshSprite3D(mesh);
		cmesh.meshRenderer.sharedMaterial = mtl;
		scene.addChild(cmesh);
		let c = cmesh.meshRenderer.bounds.getCenter();
		//cmesh.transform.localPosition = new Vector3(-c.x, -c.y, -c.z)
	});

	let wire = m2.getWireFrame();
	scene.addChild(wire);
}

main();