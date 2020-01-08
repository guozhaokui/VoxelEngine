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


//let mesh = new MeshSprite3D(createVoxMesh({get:getdata},10,10,10,10,10,10,new Vector3(0,0,0), new Vector3(10,10,10)));
//scene.addChild(mesh);
//mesh.transform.localPosition = new Vector3(-5,-5,-5)
/*
let sidelen = 44;
//let data = SphereData(-2,2,sidelen);
let data = SphereData(-2, 2, sidelen);

let isos = new SurfaceNets();
//let mesh1 = isos.tomesh(data.data,data.dims);
//test data
*/

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

async function main() {
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
				let dx = x-c; dx/=21;
				let dy = y-c; dy/=21;
				let dz = z-c; dz/=21;
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
	let ss = 90;
	switch(ss){
		case 0:
			vox.to(2,2,2,true);
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
	}


	let m2 = new SurfaceNetSmoother();
	m2.createSurfaceNet(vox.data, vox.dims);
	//m2.relaxSurfaceNet(12);

	var mtl = new BlinnPhongMaterial();
	mtl.cull = RenderState.CULL_NONE;
	mtl.blend = RenderState.BLEND_ENABLE_ALL;
	mtl.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
	mtl.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
	mtl.depthTest = RenderState.DEPTHTEST_LESS;

	if(true){
		let rmeshes:MeshSprite3D[]=[];
		for(let i=0; i<1000; i++){
			m2.relaxSurfaceNet(1);
			let meshes = m2.toMeshes();
			meshes.forEach(mesh => {
				let cmesh = new MeshSprite3D(mesh);
				cmesh.meshRenderer.sharedMaterial = mtl;
				rmeshes.push(cmesh);
				scene.addChild(cmesh);
				let c = cmesh.meshRenderer.bounds.getCenter();
				cmesh.transform.localPosition = new Vector3(-c.x, -c.y, -c.z)
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
		cmesh.transform.localPosition = new Vector3(-c.x, -c.y, -c.z)
	});
}

main();