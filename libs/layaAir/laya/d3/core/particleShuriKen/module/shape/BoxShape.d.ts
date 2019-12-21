import { BaseShape } from "./BaseShape";
import { Rand } from "../../../../math/Rand";
import { Vector3 } from "../../../../math/Vector3";
/**
 * <code>BoxShape</code> 类用于创建球形粒子形状。
 */
export declare class BoxShape extends BaseShape {
    /**发射器X轴长度。*/
    x: number;
    /**发射器Y轴长度。*/
    y: number;
    /**发射器Z轴长度。*/
    z: number;
    /**
     * 创建一个 <code>BoxShape</code> 实例。
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
     * @param destObject
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
