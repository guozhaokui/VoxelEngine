import { BaseTexture } from "../../../resource/BaseTexture";
import { Vector4 } from "../../math/Vector4";
import { Material } from "../material/Material";
import { ShaderDefine } from "../../shader/ShaderDefine";
/**
 * <code>TrailMaterial</code> 类用于实现拖尾材质。
 */
export declare class TrailMaterial extends Material {
    /**渲染状态_透明混合。*/
    static RENDERMODE_ALPHABLENDED: number;
    /**渲染状态_加色法混合。*/
    static RENDERMODE_ADDTIVE: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: TrailMaterial;
    static SHADERDEFINE_MAINTEXTURE: ShaderDefine;
    static SHADERDEFINE_TILINGOFFSET: ShaderDefine;
    static SHADERDEFINE_ADDTIVEFOG: ShaderDefine;
    static MAINTEXTURE: number;
    static TINTCOLOR: number;
    static TILINGOFFSET: number;
    static CULL: number;
    static BLEND: number;
    static BLEND_SRC: number;
    static BLEND_DST: number;
    static DEPTH_TEST: number;
    static DEPTH_WRITE: number;
    /**
     * 设置渲染模式。
     * @return 渲染模式。
     */
    set renderMode(value: number);
    /**
     * 获取颜色R分量。
     * @return 颜色R分量。
     */
    get colorR(): number;
    /**
     * 设置颜色R分量。
     * @param value 颜色R分量。
     */
    set colorR(value: number);
    /**
     * 获取颜色G分量。
     * @return 颜色G分量。
     */
    get colorG(): number;
    /**
     * 设置颜色G分量。
     * @param value 颜色G分量。
     */
    set colorG(value: number);
    /**
     * 获取颜色B分量。
     * @return 颜色B分量。
     */
    get colorB(): number;
    /**
     * 设置颜色B分量。
     * @param value 颜色B分量。
     */
    set colorB(value: number);
    /**
     * 获取颜色Z分量。
     * @return 颜色Z分量。
     */
    get colorA(): number;
    /**
     * 设置颜色alpha分量。
     * @param value 颜色alpha分量。
     */
    set colorA(value: number);
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
     * 获取贴图。
     * @return 贴图。
     */
    get texture(): BaseTexture;
    /**
     * 设置贴图。
     * @param value 贴图。
     */
    set texture(value: BaseTexture);
    /**
     * 获取纹理平铺和偏移X分量。
     * @return 纹理平铺和偏移X分量。
     */
    get tilingOffsetX(): number;
    /**
     * 获取纹理平铺和偏移X分量。
     * @param x 纹理平铺和偏移X分量。
     */
    set tilingOffsetX(x: number);
    /**
     * 获取纹理平铺和偏移Y分量。
     * @return 纹理平铺和偏移Y分量。
     */
    get tilingOffsetY(): number;
    /**
     * 获取纹理平铺和偏移Y分量。
     * @param y 纹理平铺和偏移Y分量。
     */
    set tilingOffsetY(y: number);
    /**
     * 获取纹理平铺和偏移Z分量。
     * @return 纹理平铺和偏移Z分量。
     */
    get tilingOffsetZ(): number;
    /**
     * 获取纹理平铺和偏移Z分量。
     * @param z 纹理平铺和偏移Z分量。
     */
    set tilingOffsetZ(z: number);
    /**
     * 获取纹理平铺和偏移W分量。
     * @return 纹理平铺和偏移W分量。
     */
    get tilingOffsetW(): number;
    /**
     * 获取纹理平铺和偏移W分量。
     * @param w 纹理平铺和偏移W分量。
     */
    set tilingOffsetW(w: number);
    /**
     * 获取纹理平铺和偏移。
     * @return 纹理平铺和偏移。
     */
    get tilingOffset(): Vector4;
    /**
     * 设置纹理平铺和偏移。
     * @param value 纹理平铺和偏移。
     */
    set tilingOffset(value: Vector4);
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
    /**
     * @inheritdoc
     * @override
     */
    clone(): any;
}
