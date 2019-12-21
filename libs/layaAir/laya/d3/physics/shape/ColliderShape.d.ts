import { IClone } from "../../core/IClone";
import { Quaternion } from "../../math/Quaternion";
import { Vector3 } from "../../math/Vector3";
/**
 * <code>ColliderShape</code> 类用于创建形状碰撞器的父类，该类为抽象类。
 */
export declare class ColliderShape implements IClone {
    /** 形状方向_X轴正向 */
    static SHAPEORIENTATION_UPX: number;
    /** 形状方向_Y轴正向 */
    static SHAPEORIENTATION_UPY: number;
    /** 形状方向_Z轴正向 */
    static SHAPEORIENTATION_UPZ: number;
    needsCustomCollisionCallback: boolean;
    /**
     * 碰撞类型。
     */
    get type(): number;
    /**
     * Shape的本地偏移。
     */
    get localOffset(): Vector3;
    set localOffset(value: Vector3);
    /**
     * Shape的本地旋转。
     */
    get localRotation(): Quaternion;
    set localRotation(value: Quaternion);
    /**
     * 创建一个新的 <code>ColliderShape</code> 实例。
     */
    constructor();
    /**
     * 更新本地偏移,如果修改LocalOffset或LocalRotation需要调用。
     */
    updateLocalTransformations(): void;
    /**
     * 克隆。
     * @param	destObject 克隆源。
     */
    cloneTo(destObject: any): void;
    /**
     * 克隆。
     * @return 克隆副本。
     */
    clone(): any;
    /**
     * 销毁。
     */
    destroy(): void;
}
