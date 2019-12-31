import { Vector3 } from "laya/d3/math/Vector3";
import { noise } from "./PerlinNoise";


/**
 * 生成一个立方体数据
 * @param min 最小值，xyz都是这个
 * @param max 
 * @param sidelen 数据边长，int类型
 * @param f 
 */
export function genVoxData(min: number, max: number, sidelen: i32, f: (x: number, y: number, z: number) => number) {
	let d = max - min;
	let gridw = d / sidelen;
	let hf = gridw / 2;
	let data = new Float32Array(sidelen ** 3);
	let ci = 0;
	//xyz是格子中心坐标
	let cy = min + hf;
	for (let dy = 0; dy < sidelen; dy++ , cy += gridw) {
		let cz = min + hf;
		for (let dz = 0; dz < sidelen; dz++ , cz += gridw) {
			let cx = min + hf;
			for (let dx = 0; dx < sidelen; dx++ , cx += gridw) {
				data[ci++] = f(cx, cy, cz);
			}
		}
	}
	return data;
}

export function SphereData(min: number, max: number, sidelen: int) {
	return { data: genVoxData(min, max, sidelen,
		(x, y, z) => {
			return x * x + y * y + z * z - 1.0;
		}
	),
	dims:[sidelen,sidelen,sidelen]
	};
}

export function Goursats_Surface(min:number,max:number, sidelen:int){
	return {data:genVoxData(min,max,sidelen,
		(x,y,z)=>{
			return Math.pow(x, 4) + Math.pow(y, 4) + Math.pow(z, 4) - 1.5 * (x * x + y * y + z * z) + 1;
		}
	),
	dims:[sidelen,sidelen,sidelen]};
} 

export function Sine_Waves(min:number,max:number,sidelen:int){
	return {data:genVoxData(min,max,sidelen,
		(x,y,z)=>{
			return Math.sin(x) + Math.sin(y) + Math.sin(z);
		}
	),
	dims:[sidelen,sidelen,sidelen]};
} 	

export function Perlin_Noise(min:number,max:number,sidelen:int){
	return {data:genVoxData(min,max,sidelen,
		(x,y,z)=>{
			return noise(x, y, z) - 0.5;
		}
	),
	dims:[sidelen,sidelen,sidelen]};
} 	

export function Terrain(min:number,max:number,sidelen:int){
	return genVoxData(min,max,sidelen,
		(x,y,z)=>{
			return y + noise(x * 2 + 5, y * 2 + 3, z * 2 + 0.6);
		}
	);
} 	
