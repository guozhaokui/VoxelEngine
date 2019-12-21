import { ColliderShape } from "./ColliderShape";
/**
 * <code>CompoundColliderShape</code> 类用于创建盒子形状碰撞器。
 */
export declare class CompoundColliderShape extends ColliderShape {
    /**
     * 创建一个新的 <code>CompoundColliderShape</code> 实例。
     */
    constructor();
    /**
     * 添加子碰撞器形状。
     * @param	shape 子碰撞器形状。
     */
    addChildShape(shape: ColliderShape): void;
    /**
     * 移除子碰撞器形状。
     * @param	shape 子碰撞器形状。
     */
    removeChildShape(shape: ColliderShape): void;
    /**
     * 清空子碰撞器形状。
     */
    clearChildShape(): void;
    /**
     * 获取子形状数量。
     * @return
     */
    getChildShapeCount(): number;
    /**
     * @inheritDoc
     * @override
     */
    cloneTo(destObject: any): void;
    /**
     * @inheritDoc
     * @override
     */
    clone(): any;
    /**
     * @inheritDoc
     * @override
     */
    destroy(): void;
}
