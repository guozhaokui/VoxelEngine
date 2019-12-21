import { TrailFilter } from "./TrailFilter";
import { TrailRenderer } from "./TrailRenderer";
import { RenderableSprite3D } from "../RenderableSprite3D";
/**
 * <code>TrailSprite3D</code> 类用于创建拖尾渲染精灵。
 */
export declare class TrailSprite3D extends RenderableSprite3D {
    /**
     * Trail过滤器。
     */
    get trailFilter(): TrailFilter;
    /**
     * Trail渲染器。
     */
    get trailRenderer(): TrailRenderer;
    constructor(name?: string);
    /**
     * @inheritDoc
     * @override
     */
    protected _onActive(): void;
    /**
     * <p>销毁此对象。</p>
     * @param	destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
     * @override
     */
    destroy(destroyChild?: boolean): void;
}
