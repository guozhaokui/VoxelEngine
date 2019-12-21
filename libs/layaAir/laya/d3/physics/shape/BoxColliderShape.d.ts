import { ColliderShape } from "./ColliderShape";
/**
 * <code>BoxColliderShape</code> 类用于创建盒子形状碰撞器。
 */
export declare class BoxColliderShape extends ColliderShape {
    /**
     * X轴尺寸。
     */
    get sizeX(): number;
    /**
     * Y轴尺寸。
     */
    get sizeY(): number;
    /**
     * Z轴尺寸。
     */
    get sizeZ(): number;
    /**
     * 创建一个新的 <code>BoxColliderShape</code> 实例。
     * @param sizeX 盒子X轴尺寸。
     * @param sizeY 盒子Y轴尺寸。
     * @param sizeZ 盒子Z轴尺寸。
     */
    constructor(sizeX?: number, sizeY?: number, sizeZ?: number);
    /**
     * @inheritDoc
     * @override
     */
    clone(): any;
}
