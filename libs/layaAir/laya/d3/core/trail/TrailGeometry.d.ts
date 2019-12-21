import { GeometryElement } from "../GeometryElement";
import { TrailFilter } from "./TrailFilter";
/**
 * <code>TrailGeometry</code> 类用于创建拖尾渲染单元。
 */
export declare class TrailGeometry extends GeometryElement {
    /** 轨迹准线_面向摄像机。*/
    static ALIGNMENT_VIEW: number;
    /** 轨迹准线_面向运动方向。*/
    static ALIGNMENT_TRANSFORM_Z: number;
    private tmpColor;
    /** @private */
    private _disappearBoundsMode;
    constructor(owner: TrailFilter);
    /**
     * @inheritDoc
     * @override
     */
    _getType(): number;
    /**
     * @inheritDoc
     * @override
     */
    destroy(): void;
}
