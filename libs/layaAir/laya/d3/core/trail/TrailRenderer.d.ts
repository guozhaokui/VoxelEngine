import { TrailSprite3D } from "./TrailSprite3D";
import { BaseRender } from "../render/BaseRender";
import { Matrix4x4 } from "../../math/Matrix4x4";
/**
 * <code>TrailRenderer</code> 类用于创建拖尾渲染器。
 */
export declare class TrailRenderer extends BaseRender {
    constructor(owner: TrailSprite3D);
    protected _projectionViewWorldMatrix: Matrix4x4;
}
