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



function getdata(x: number, y: number, z: number): number {
	return Math.random() > 0.5 ? 1 : 0;
	return 0;
}

//let mesh = new MeshSprite3D(createVoxMesh({get:getdata},10,10,10,10,10,10,new Vector3(0,0,0), new Vector3(10,10,10)));
//scene.addChild(mesh);
//mesh.transform.localPosition = new Vector3(-5,-5,-5)

let sidelen = 44;
//let data = SphereData(-2,2,sidelen);
let data = SphereData(-2, 2, sidelen);

let isos = new SurfaceNets();
//let mesh1 = isos.tomesh(data.data,data.dims);
//test data
if (true) {
	let s = 500;
	let distZ = s;
	let distY = s * s;
	data.data = new Float32Array(s ** 3);
	data.data.fill(-1);
	data.dims = [s, s, s];

	/*
	let c=(s/2)|0
	for(let z=0; z<s; z++){
		for(let y=0; y<s; y++){
			for(let x=0; x<s; x++){
				let dx = x-c; dx/=c;
				let dy = y-c; dy/=c;
				let dz = z-c; dz/=c;
				let r = Math.sqrt(dx*dx+dy*dy+dz*dz)-1;
				if(r<0)r=1;
				else r=0;
				data.data[x+y*distY+z*distZ] = r;
			}
		}
	}
	*/
	for (let z = 2; z < 40; z++) {
		for (let y = 2; y < 40; y++) {
			for (let x = 2; x < 40; x++) {
				data.data[x + y * distY + z * distZ] = 1;
				if (z == 39 ) {
					data.data[x + y * distY + z * distZ] = 1+Math.random();
				}
			}
		}
	}
}
//test data end

let m2 = new SurfaceNetSmoother();
m2.createSurfaceNet(data.data, data.dims);
console.time('relaxnet');
m2.relaxSurfaceNet(200);
console.timeEnd('relaxnet');

//let mesh1 = MarchingCubes(data.data, data.dims);
//let mesh1 = isos.tomesh(new Float32Array([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]),[4,1,4]);

let gridq = new Quaternion();
Quaternion.createFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 4, gridq);
let grid = new GridSurface(10, null, null);
//grid.showAxis=false;
grid.addToScene(scene);

//let meshes = polyToTriMesh(mesh1.vertices, mesh1.faces);
let meshes = m2.toMeshes();

meshes.forEach(mesh => {
	let cmesh = new MeshSprite3D(mesh);
	var mtl = new BlinnPhongMaterial();
	mtl.cull = RenderState.CULL_NONE;
	mtl.blend = RenderState.BLEND_ENABLE_ALL;
	mtl.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
	mtl.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
	mtl.depthTest = RenderState.DEPTHTEST_LESS;
	cmesh.meshRenderer.sharedMaterial = mtl;

	scene.addChild(cmesh);
	cmesh.transform.localPosition = new Vector3(-10, 0, 0)
});


