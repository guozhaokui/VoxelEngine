import { BaseTexture } from "../../../resource/BaseTexture";
import { Vector4 } from "../../math/Vector4";
import { Material } from "./Material";
import { ShaderDefine } from "../../shader/ShaderDefine";
/**
 * <code>PBRStandardMaterial</code> 类用于实现PBR(Standard)材质。
 */
export declare class PBRStandardMaterial extends Material {
    /**光滑度数据源_金属度贴图的Alpha通道。*/
    static SmoothnessSource_MetallicGlossTexture_Alpha: number;
    /**光滑度数据源_反射率贴图的Alpha通道。*/
    static SmoothnessSource_AlbedoTexture_Alpha: number;
    /**渲染状态_不透明。*/
    static RENDERMODE_OPAQUE: number;
    /**渲染状态_透明测试。*/
    static RENDERMODE_CUTOUT: number;
    /**渲染状态_透明混合_游戏中经常使用的透明。*/
    static RENDERMODE_FADE: number;
    /**渲染状态_透明混合_物理上看似合理的透明。*/
    static RENDERMODE_TRANSPARENT: number;
    static SHADERDEFINE_ALBEDOTEXTURE: ShaderDefine;
    static SHADERDEFINE_NORMALTEXTURE: ShaderDefine;
    static SHADERDEFINE_SMOOTHNESSSOURCE_ALBEDOTEXTURE_ALPHA: ShaderDefine;
    static SHADERDEFINE_METALLICGLOSSTEXTURE: ShaderDefine;
    static SHADERDEFINE_OCCLUSIONTEXTURE: ShaderDefine;
    static SHADERDEFINE_PARALLAXTEXTURE: ShaderDefine;
    static SHADERDEFINE_EMISSION: ShaderDefine;
    static SHADERDEFINE_EMISSIONTEXTURE: ShaderDefine;
    static SHADERDEFINE_REFLECTMAP: ShaderDefine;
    static SHADERDEFINE_TILINGOFFSET: ShaderDefine;
    static SHADERDEFINE_ALPHAPREMULTIPLY: ShaderDefine;
    static ALBEDOTEXTURE: number;
    static METALLICGLOSSTEXTURE: number;
    static NORMALTEXTURE: number;
    static PARALLAXTEXTURE: number;
    static OCCLUSIONTEXTURE: number;
    static EMISSIONTEXTURE: number;
    static ALBEDOCOLOR: number;
    static EMISSIONCOLOR: number;
    static METALLIC: number;
    static SMOOTHNESS: number;
    static SMOOTHNESSSCALE: number;
    static SMOOTHNESSSOURCE: number;
    static OCCLUSIONSTRENGTH: number;
    static NORMALSCALE: number;
    static PARALLAXSCALE: number;
    static ENABLEEMISSION: number;
    static ENABLEREFLECT: number;
    static TILINGOFFSET: number;
    static CULL: number;
    static BLEND: number;
    static BLEND_SRC: number;
    static BLEND_DST: number;
    static DEPTH_TEST: number;
    static DEPTH_WRITE: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: PBRStandardMaterial;
    set _ColorR(value: number);
    set _ColorG(value: number);
    set _ColorB(value: number);
    set _ColorA(value: number);
    set _Metallic(value: number);
    set _Glossiness(value: number);
    set _GlossMapScale(value: number);
    set _BumpScale(value: number);
    set _Parallax(value: number);
    set _OcclusionStrength(value: number);
    set _EmissionColorR(value: number);
    set _EmissionColorG(value: number);
    set _EmissionColorB(value: number);
    set _EmissionColorA(value: number);
    set _MainTex_STX(x: number);
    set _MainTex_STY(y: number);
    set _MainTex_STZ(z: number);
    set _MainTex_STW(w: number);
    set _Cutoff(value: number);
    /**
     * 反射率颜色R分量。
     */
    get albedoColorR(): number;
    set albedoColorR(value: number);
    /**
     * 反射率颜色G分量。
     */
    get albedoColorG(): number;
    set albedoColorG(value: number);
    /**
     * 反射率颜色B分量。
     */
    get albedoColorB(): number;
    set albedoColorB(value: number);
    /**
     * 反射率颜色Z分量。
     */
    get albedoColorA(): number;
    set albedoColorA(value: number);
    /**
     * 漫反射颜色。
     */
    get albedoColor(): Vector4;
    set albedoColor(value: Vector4);
    /**
     * 漫反射贴图。
     */
    get albedoTexture(): BaseTexture;
    set albedoTexture(value: BaseTexture);
    /**
     * 法线贴图。
     */
    get normalTexture(): BaseTexture;
    set normalTexture(value: BaseTexture);
    /**
     * 法线贴图缩放系数。
     */
    get normalTextureScale(): number;
    set normalTextureScale(value: number);
    /**
     * 视差贴图。
     */
    get parallaxTexture(): BaseTexture;
    set parallaxTexture(value: BaseTexture);
    /**
     * 视差贴图缩放系数。
     */
    get parallaxTextureScale(): number;
    set parallaxTextureScale(value: number);
    /**
     * 遮挡贴图。
     */
    get occlusionTexture(): BaseTexture;
    set occlusionTexture(value: BaseTexture);
    /**
     * 遮挡贴图强度,范围为0到1。
     */
    get occlusionTextureStrength(): number;
    set occlusionTextureStrength(value: number);
    /**
     * 金属光滑度贴图。
     */
    get metallicGlossTexture(): BaseTexture;
    set metallicGlossTexture(value: BaseTexture);
    /**
     * 获取金属度,范围为0到1。
     */
    get metallic(): number;
    set metallic(value: number);
    /**
     * 光滑度,范围为0到1。
     */
    get smoothness(): number;
    set smoothness(value: number);
    /**
     * 光滑度缩放系数,范围为0到1。
     */
    get smoothnessTextureScale(): number;
    set smoothnessTextureScale(value: number);
    /**
     * 光滑度数据源,0或1。
     */
    get smoothnessSource(): number;
    set smoothnessSource(value: number);
    /**
     * 是否激活放射属性。
     */
    get enableEmission(): boolean;
    set enableEmission(value: boolean);
    /**
     * 放射颜色R分量。
     */
    get emissionColorR(): number;
    set emissionColorR(value: number);
    /**
     * 放射颜色G分量。
     */
    get emissionColorG(): number;
    set emissionColorG(value: number);
    /**
     * 放射颜色B分量。
     */
    get emissionColorB(): number;
    set emissionColorB(value: number);
    /**
     * 放射颜色A分量。
     */
    get emissionColorA(): number;
    set emissionColorA(value: number);
    /**
     * 放射颜色。
     */
    get emissionColor(): Vector4;
    set emissionColor(value: Vector4);
    /**
     * 放射贴图。
     */
    get emissionTexture(): BaseTexture;
    set emissionTexture(value: BaseTexture);
    /**
     * 是否开启反射。
     */
    get enableReflection(): boolean;
    set enableReflection(value: boolean);
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
     * 渲染模式。
     */
    set renderMode(value: number);
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
    /**
     * 创建一个 <code>PBRStandardMaterial</code> 实例。
     */
    constructor();
    /**
     * 克隆。
     * @return	 克隆副本。
     * @override
     */
    clone(): any;
    /**
     * @inheritDoc
     * @override
     */
    cloneTo(destObject: any): void;
}
