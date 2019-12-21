import { Mesh } from "../resource/models/Mesh";
import { RenderableSprite3D } from "./RenderableSprite3D";
/**
 * <code>MeshFilter</code> 类用于创建网格过滤器。
 */
export declare class MeshFilter {
    /**
     * 共享网格。
     */
    get sharedMesh(): Mesh;
    set sharedMesh(value: Mesh);
    /**
     * 创建一个新的 <code>MeshFilter</code> 实例。
     * @param owner 所属网格精灵。
     */
    constructor(owner: RenderableSprite3D);
    /**
     * @inheritDoc
     */
    destroy(): void;
}
