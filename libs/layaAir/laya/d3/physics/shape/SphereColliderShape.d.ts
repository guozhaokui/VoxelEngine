import { ColliderShape } from "./ColliderShape";
/**
 * <code>SphereColliderShape</code> 类用于创建球形碰撞器。
 */
export declare class SphereColliderShape extends ColliderShape {
    /**
     * 半径。
     */
    get radius(): number;
    /**
     * 创建一个新的 <code>SphereColliderShape</code> 实例。
     * @param radius 半径。
     */
    constructor(radius?: number);
    /**
     * @inheritDoc
     * @override
     */
    clone(): any;
}
