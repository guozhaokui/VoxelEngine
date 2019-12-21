import { BaseShape } from "./BaseShape";
import { Rand } from "../../../../math/Rand";
import { Vector3 } from "../../../../math/Vector3";
/**
 * <code>ConeShape</code> 类用于创建锥形粒子形状。
 */
export declare class ConeShape extends BaseShape {
    /**发射角度。*/
    angle: number;
    /**发射器半径。*/
    radius: number;
    /**椎体长度。*/
    length: number;
    /**发射类型,0为Base,1为BaseShell,2为Volume,3为VolumeShell。*/
    emitType: number;
    /**
     * 创建一个 <code>ConeShape</code> 实例。
     */
    constructor();
    /**
     *  用于生成粒子初始位置和方向。
     * @param	position 粒子位置。
     * @param	direction 粒子方向。
     * @override
     */
    generatePositionAndDirection(position: Vector3, direction: Vector3, rand?: Rand, randomSeeds?: Uint32Array): void;
    /**
     * @override
     */
    cloneTo(destObject: any): void;
    /**
     * @override
     * 克隆。
     * @return	 克隆副本。
     */
    clone(): any;
}
