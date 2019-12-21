import { Vector3 } from "../../math/Vector3";
import { FloatKeyframe } from "../FloatKeyframe";
import { Gradient } from "../Gradient";
import { TrailSprite3D } from "./TrailSprite3D";
/**
 * <code>TrailFilter</code> 类用于创建拖尾过滤器。
 */
export declare class TrailFilter {
    static CURTIME: number;
    static LIFETIME: number;
    static WIDTHCURVE: number;
    static WIDTHCURVEKEYLENGTH: number;
    _owner: TrailSprite3D;
    _lastPosition: Vector3;
    _curtime: number;
    /**轨迹准线。*/
    alignment: number;
    /**
     * 获取淡出时间。
     * @return  淡出时间。
     */
    get time(): number;
    /**
     * 设置淡出时间。
     * @param value 淡出时间。
     */
    set time(value: number);
    /**
     * 获取新旧顶点之间最小距离。
     * @return  新旧顶点之间最小距离。
     */
    get minVertexDistance(): number;
    /**
     * 设置新旧顶点之间最小距离。
     * @param value 新旧顶点之间最小距离。
     */
    set minVertexDistance(value: number);
    /**
     * 获取宽度倍数。
     * @return  宽度倍数。
     */
    get widthMultiplier(): number;
    /**
     * 设置宽度倍数。
     * @param value 宽度倍数。
     */
    set widthMultiplier(value: number);
    /**
     * 获取宽度曲线。
     * @return  宽度曲线。
     */
    get widthCurve(): FloatKeyframe[];
    /**
     * 设置宽度曲线。
     * @param value 宽度曲线。
     */
    set widthCurve(value: FloatKeyframe[]);
    /**
     * 获取颜色梯度。
     * @return  颜色梯度。
     */
    get colorGradient(): Gradient;
    /**
     * 设置颜色梯度。
     * @param value 颜色梯度。
     */
    set colorGradient(value: Gradient);
    /**
     * 获取纹理模式。
     * @return  纹理模式。
     */
    get textureMode(): number;
    /**
     * 设置纹理模式。
     * @param value 纹理模式。
     */
    set textureMode(value: number);
    constructor(owner: TrailSprite3D);
    /** 轨迹准线_面向摄像机。*/
    static ALIGNMENT_VIEW: number;
    /** 轨迹准线_面向运动方向。*/
    static ALIGNMENT_TRANSFORM_Z: number;
}
