import { Vector4 } from "../../math/Vector4";
import { Material } from "./Material";
/**
 * <code>SkyProceduralMaterial</code> 类用于实现SkyProceduralMaterial材质。
 */
export declare class SkyProceduralMaterial extends Material {
    /** 太阳_无*/
    static SUN_NODE: number;
    /** 太阳_精简*/
    static SUN_SIMPLE: number;
    /** 太阳_高质量*/
    static SUN_HIGH_QUALITY: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: SkyProceduralMaterial;
    /**
     * 太阳状态。
     */
    get sunDisk(): number;
    set sunDisk(value: number);
    /**
     * 太阳尺寸,范围是0到1。
     */
    get sunSize(): number;
    set sunSize(value: number);
    /**
     * 太阳尺寸收缩,范围是0到20。
     */
    get sunSizeConvergence(): number;
    set sunSizeConvergence(value: number);
    /**
     * 大气厚度,范围是0到5。
     */
    get atmosphereThickness(): number;
    set atmosphereThickness(value: number);
    /**
     * 天空颜色。
     */
    get skyTint(): Vector4;
    set skyTint(value: Vector4);
    /**
     * 地面颜色。
     */
    get groundTint(): Vector4;
    set groundTint(value: Vector4);
    /**
     * 曝光强度,范围是0到8。
     */
    get exposure(): number;
    set exposure(value: number);
    /**
     * 创建一个 <code>SkyProceduralMaterial</code> 实例。
     */
    constructor();
    /**
     * 克隆。
     * @return	 克隆副本。
     * @override
     */
    clone(): any;
}
