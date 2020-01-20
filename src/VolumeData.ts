import { Ray } from "laya/d3/math/Ray";
import { Vector3 } from "laya/d3/math/Vector3";


class NodeData{
	value=0; 	//x,y,z各占8bit
}

export class VolumeData{
	size=128;
	data:number[] = [];
	opPath:Vector3[]=[];
	startPos:Vector3;

	setSize(w:int){
		this.size=w;
		this.data.length = w**3;
	}

	//test data
	genSphere(x:int,y:int,z:int, r:number){

	}

	//edit
	select(r:Ray){

	}

	/**
	 * move路径只有一个
	 * @param pos 
	 */
	op_MoveStart(pos:Vector3){
		pos.cloneTo(this.startPos);
		//this.opPath.push(pos);
	}
	op_MoveMove(to:Vector3){
		//this.opPath.push(to);
		//TODO 去掉太近的
		//this.op_Update();
		this.op_applyMove(this.startPos,to);
	}

	op_applyMove(start:Vector3, end:Vector3){

	}

}