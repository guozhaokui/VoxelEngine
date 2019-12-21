import { BaseTexture } from "../../../resource/BaseTexture";
import { Vector4 } from "../../math/Vector4";
import { Material } from "./Material";
import { ShaderDefine } from "../../shader/ShaderDefine";
/**
 * <code>EffectMaterial</code> 类用于实现Mesh特效材质。
 */
export declare class EffectMaterial extends Material {
    /**渲染状态_加色法混合。*/
    static RENDERMODE_ADDTIVE: number;
    /**渲染状态_透明混合。*/
    static RENDERMODE_ALPHABLENDED: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: EffectMaterial;
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
    private _color;
    set _TintColorR(value: number);
    set _TintColorG(value: number);
    set _TintColorB(value: number);
    set _TintColorA(value: number);
    set _MainTex_STX(x: number);
    set _MainTex_STY(y: number);
    set _MainTex_STZ(z: number);
    set _MainTex_STW(w: number);
    /**
     * 设置渲染模式。
     */
    set renderMode(value: number);
    /**
     * 颜色R分量。
     */
    get colorR(): number;
    set colorR(value: number);
    /**
     * 颜色G分量。
     */
    get colorG(): number;
    set colorG(value: number);
    /**
     * 颜色B分量。
     */
    get colorB(): number;
    set colorB(value: number);
    /**
     * 颜色A分量。
     */
    get colorA(): number;
    set colorA(value: number);
    /**
     * 获取颜色。
     */
    get color(): Vector4;
    set color(value: Vector4);
    /**
     * 贴图。
     */
    get texture(): BaseTexture;
    set texture(value: BaseTexture);
    /**
     * 纹理平铺和偏移X分量。
     */
    get tilingOffsetX(): number;
    set tilingOffsetX(x: number);
    /**
     * 纹理平铺和偏移Y分量。
     */
    get tilingOffsetY(): number;
    set tilingOffsetY(y: number);
    /**
     * 纹理平铺和偏移Z分量。
     */
    get tilingOffsetZ(): number;
    set tilingOffsetZ(z: number);
    /**
     * 纹理平铺和偏移W分量。
     */
    get tilingOffsetW(): number;
    set tilingOffsetW(w: number);
    /**
     * 纹理平铺和偏移。
     */
    get tilingOffset(): Vector4;
    set tilingOffset(value: Vector4);
    /**
     * 是否写入深度。
     */
    get depthWrite(): boolean;
    set depthWrite(value: boolean);
    /**
     * 剔除方式。
     */
    get cull(): number;
    set cull(value: number);
    /**
     * 混合方式。
     */
    get blend(): number;
    set blend(value: number);
    /**
     * 混合源。
     */
    get blendSrc(): number;
    set blendSrc(value: number);
    /**
     * 混合目标。
     */
    get blendDst(): number;
    set blendDst(value: number);
    /**
     * 深度测试方式。
     */
    get depthTest(): number;
    set depthTest(value: number);
    constructor();
    /**
     * 克隆。
     * @return	 克隆副本。
     * @override
     */
    clone(): any;
}
