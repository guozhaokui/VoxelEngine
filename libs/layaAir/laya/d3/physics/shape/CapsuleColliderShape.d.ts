import { ColliderShape } from "./ColliderShape";
/**
 * <code>CapsuleColliderShape</code> 类用于创建胶囊形状碰撞器。
 */
export declare class CapsuleColliderShape extends ColliderShape {
    /**
     * 半径。
     */
    get radius(): number;
    /**
     * 长度。
     */
    get length(): number;
    /**
     * 方向。
     */
    get orientation(): number;
    /**
     * 创建一个新的 <code>CapsuleColliderShape</code> 实例。
     * @param 半径。
     * @param 高(包含半径)。
     * @param orientation 胶囊体方向。
     */
    constructor(radius?: number, length?: number, orientation?: number);
    /**
     * @inheritDoc
     * @override
     */
    clone(): any;
}
