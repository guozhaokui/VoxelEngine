import { Vector3 } from "../../math/Vector3";
import { Sprite3D } from "../Sprite3D";
/**
 * <code>LightSprite</code> 类用于创建灯光的父类。
 */
export declare class LightSprite extends Sprite3D {
    /** 灯光烘培类型-实时。*/
    static LIGHTMAPBAKEDTYPE_REALTIME: number;
    /** 灯光烘培类型-混合。*/
    static LIGHTMAPBAKEDTYPE_MIXED: number;
    /** 灯光烘培类型-烘焙。*/
    static LIGHTMAPBAKEDTYPE_BAKED: number;
    /** 灯光颜色。 */
    color: Vector3;
    /**
     * 灯光强度。
     */
    get intensity(): number;
    set intensity(value: number);
    /**
     * 是否产生阴影。
     */
    get shadow(): boolean;
    set shadow(value: boolean);
    /**
     * 阴影最远范围。
     */
    get shadowDistance(): number;
    set shadowDistance(value: number);
    /**
     * 阴影贴图尺寸。
     */
    get shadowResolution(): number;
    set shadowResolution(value: number);
    /**
     * 阴影分段数。
     */
    get shadowPSSMCount(): number;
    set shadowPSSMCount(value: number);
    /**
     * 阴影PCF类型。
     */
    get shadowPCFType(): number;
    set shadowPCFType(value: number);
    /**
     * 灯光烘培类型。
     */
    get lightmapBakedType(): number;
    set lightmapBakedType(value: number);
    /**
     * 创建一个 <code>LightSprite</code> 实例。
     */
    constructor();
    /**
     * @inheritDoc
     * @override
     */
    protected _onActive(): void;
    /**
     * @inheritDoc
     * @override
     */
    protected _onInActive(): void;
    /**
     * 灯光的漫反射颜色。
     * @return 灯光的漫反射颜色。
     */
    get diffuseColor(): Vector3;
    set diffuseColor(value: Vector3);
}
