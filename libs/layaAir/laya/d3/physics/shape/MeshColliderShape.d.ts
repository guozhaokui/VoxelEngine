import { Mesh } from "../../resource/models/Mesh";
import { ColliderShape } from "./ColliderShape";
/**
 * <code>MeshColliderShape</code> 类用于创建网格碰撞器。
 */
export declare class MeshColliderShape extends ColliderShape {
    /**
     * 网格。
     */
    get mesh(): Mesh;
    set mesh(value: Mesh);
    /**
     * 是否使用凸多边形。
     */
    get convex(): boolean;
    set convex(value: boolean);
    /**
     * 创建一个新的 <code>MeshColliderShape</code> 实例。
     */
    constructor();
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
}
