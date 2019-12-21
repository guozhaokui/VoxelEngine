import { RenderableSprite3D } from "./RenderableSprite3D";
import { MeshFilter } from "./MeshFilter";
import { MeshRenderer } from "./MeshRenderer";
import { Mesh } from "../resource/models/Mesh";
/**
 * <code>MeshSprite3D</code> 类用于创建网格。
 */
export declare class MeshSprite3D extends RenderableSprite3D {
    private _meshFilter;
    /**
     * 网格过滤器。
     */
    get meshFilter(): MeshFilter;
    /**
     * 网格渲染器。
     */
    get meshRenderer(): MeshRenderer;
    /**
     * 创建一个 <code>MeshSprite3D</code> 实例。
     * @param mesh 网格,同时会加载网格所用默认材质。
     * @param name 名字。
     */
    constructor(mesh?: Mesh, name?: string);
    /**
     * @inheritDoc
     * @override
     */
    destroy(destroyChild?: boolean): void;
}
