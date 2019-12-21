import { Vector4 } from "../../math/Vector4";
import { Material } from "../material/Material";
/**
 * <code>PixelLineMaterial</code> 类用于实现像素线材质。
 */
export declare class PixelLineMaterial extends Material {
    static COLOR: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: PixelLineMaterial;
    static CULL: number;
    static BLEND: number;
    static BLEND_SRC: number;
    static BLEND_DST: number;
    static DEPTH_TEST: number;
    static DEPTH_WRITE: number;
    /**
     * 获取颜色。
     * @return 颜色。
     */
    get color(): Vector4;
    /**
     * 设置颜色。
     * @param value 颜色。
     */
    set color(value: Vector4);
    /**
     * 设置是否写入深度。
     * @param value 是否写入深度。
     */
    set depthWrite(value: boolean);
    /**
     * 获取是否写入深度。
     * @return 是否写入深度。
     */
    get depthWrite(): boolean;
    /**
     * 设置剔除方式。
     * @param value 剔除方式。
     */
    set cull(value: number);
    /**
     * 获取剔除方式。
     * @return 剔除方式。
     */
    get cull(): number;
    /**
     * 设置混合方式。
     * @param value 混合方式。
     */
    set blend(value: number);
    /**
     * 获取混合方式。
     * @return 混合方式。
     */
    get blend(): number;
    /**
     * 设置混合源。
     * @param value 混合源
     */
    set blendSrc(value: number);
    /**
     * 获取混合源。
     * @return 混合源。
     */
    get blendSrc(): number;
    /**
     * 设置混合目标。
     * @param value 混合目标
     */
    set blendDst(value: number);
    /**
     * 获取混合目标。
     * @return 混合目标。
     */
    get blendDst(): number;
    /**
     * 设置深度测试方式。
     * @param value 深度测试方式
     */
    set depthTest(value: number);
    /**
     * 获取深度测试方式。
     * @return 深度测试方式。
     */
    get depthTest(): number;
    constructor();
}
