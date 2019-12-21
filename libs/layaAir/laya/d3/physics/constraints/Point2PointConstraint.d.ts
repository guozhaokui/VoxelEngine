import { Vector3 } from "../../math/Vector3";
/**
 * <code>Point2PointConstraint</code> 类用于创建物理组件的父类。
 */
export declare class Point2PointConstraint {
    get pivotInA(): Vector3;
    set pivotInA(value: Vector3);
    get pivotInB(): Vector3;
    set pivotInB(value: Vector3);
    get damping(): number;
    set damping(value: number);
    get impulseClamp(): number;
    set impulseClamp(value: number);
    get tau(): number;
    set tau(value: number);
    /**
     * 创建一个 <code>Point2PointConstraint</code> 实例。
     */
    constructor();
}
