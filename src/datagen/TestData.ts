import { Vector3 } from "laya/d3/math/Vector3";


/**
 * 生成一个立方体数据
 * @param min 最小值，xyz都是这个
 * @param max 
 * @param sidelen 数据边长，int类型
 * @param f 
 */
export function genVoxData(min:number, max:number, sidelen:i32, f:(x:number,y:number,z:number)=>number){
	let d = max-min;
	let gridw = d/sidelen;
	let hf = gridw/2;
	let data = new Float32Array(sidelen**3);
	let ci=0;
	//xyz是格子中心坐标
	let cy=min+hf;
	for(let dy=0;dy<sidelen; dy++,cy+=gridw){
		let cz=min+hf;
		for(let dz=0; dz<sidelen; dz++,cz+=gridw){
			let cx=min+hf;
			for(let dx=0; dx<sidelen; dx++,cx+=gridw){
				data[ci++] = f(cx,cy,cz);
			}
		}
	}
	return data;
}