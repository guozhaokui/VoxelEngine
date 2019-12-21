import { Bounds } from "./Bounds";
import { MeshRenderer } from "./MeshRenderer";
import { RenderableSprite3D } from "./RenderableSprite3D";
import { Sprite3D } from "./Sprite3D";
/**
 * <code>SkinMeshRenderer</code> 类用于蒙皮渲染器。
 */
export declare class SkinnedMeshRenderer extends MeshRenderer {
    /**
     * 局部边界。
     */
    get localBounds(): Bounds;
    set localBounds(value: Bounds);
    /**
     * 根节点。
     */
    get rootBone(): Sprite3D;
    set rootBone(value: Sprite3D);
    /**
     * 用于蒙皮的骨骼。
     */
    get bones(): Sprite3D[];
    /**
     * 创建一个 <code>SkinnedMeshRender</code> 实例。
     */
    constructor(owner: RenderableSprite3D);
    /**
     * @override
     * 包围盒。
     */
    get bounds(): Bounds;
}
