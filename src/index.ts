import { Sprite3D } from "laya/d3/core/Sprite3D";
import { Scene3D } from "laya/d3/core/scene/Scene3D";
import { Laya } from "Laya";
import { Laya3D } from "Laya3D";
import { MeshSprite3D } from "laya/d3/core/MeshSprite3D";
import { createVoxMesh, creatQuadMesh } from "./Mesh";
import { Vector3 } from "laya/d3/math/Vector3";
import { BlinnPhongMaterial } from "laya/d3/core/material/BlinnPhongMaterial";
import { Camera } from "laya/d3/core/Camera";
import { MouseCtrl1 } from "./ctrls/MouseCtrl1";
import { Vector4 } from "laya/d3/math/Vector4";
import { DirectionLight } from "laya/d3/core/light/DirectionLight";
import { genVoxData, SphereData, Sine_Waves, Terrain, Perlin_Noise } from "./datagen/TestData";
import { SurfaceNets } from "./SurfaceNets";

//
let scene: Scene3D;
//let mtl1:BlinnPhongMaterial;
Laya3D.init(window.innerWidth, window.innerHeight);
scene = Laya.stage.addChild(new Scene3D()) as Scene3D;
let mtl2 = new BlinnPhongMaterial();

var camera = (<Camera>scene.addChild(new Camera(0, 1, 10000)));
camera.transform.translate(new Vector3(0, 0, 6));
//camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
let camctrl = camera.addComponent(MouseCtrl1) as MouseCtrl1;
camera.clearColor=new Vector4(0.01,0,0,0);
camctrl.initCamera(new Vector3(0, 0, 0), new Vector3(-15, 0, 0), 12);
//camera.addComponent(CameraMoveScript);
//camera.clearColor = null;

//light
var directionLight = (<DirectionLight>scene.addChild(new DirectionLight()));
directionLight.color = new Vector3(0.6, 0.6, 0.6);
//设置平行光的方向
var mat = directionLight.transform.worldMatrix;
mat.setForward(new Vector3(-1.0, -1.0, 1.0));
directionLight.transform.worldMatrix = mat;



function getdata(x:number,y:number,z:number):number{
	return Math.random()>0.5?1:0;
	return 0;
}

//let mesh = new MeshSprite3D(createVoxMesh({get:getdata},10,10,10,10,10,10,new Vector3(0,0,0), new Vector3(10,10,10)));
//scene.addChild(mesh);
//mesh.transform.localPosition = new Vector3(-5,-5,-5)

let sidelen=4;
//let data = SphereData(-2,2,sidelen);
let data = SphereData(-2,2,sidelen);

let isos = new SurfaceNets();
let mesh1 = isos.tomesh(data,[sidelen,sidelen,sidelen]);
//let mesh1 = isos.tomesh(new Float32Array([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]),[4,1,4]);

let meshes = creatQuadMesh(mesh1.vertices, mesh1.faces);
meshes.forEach( mesh=>{
	let cmesh = new MeshSprite3D(mesh);
	scene.addChild(cmesh);
	cmesh.transform.localPosition = new Vector3(-2,-2,-2)
});

function printLayerx(n:int){
	for(let y=0; y<sidelen; y++){
		let str='';
		for(let x=0; x<sidelen; x++){

		}
	}
}

