import { Sprite } from "laya/display/Sprite";

class ContrlPoint{

}

class ContrlNet{
	
}

/**
 * 可以覆盖在任意场景上的ui，通常要与下层对象关联
 */
class UI_Hud extends Sprite{
	public addCtrlPoint(size:number):ContrlPoint{
		return new ContrlPoint();
	}
}