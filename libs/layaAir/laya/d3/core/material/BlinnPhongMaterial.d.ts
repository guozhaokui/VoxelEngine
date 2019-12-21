import { Vector4 } from "../../math/Vector4";
import { Material } from "./Material";
import { BaseTexture } from "../../../resource/BaseTexture";
import { ShaderDefine } from "../../shader/ShaderDefine";
/**
 * <code>BlinnPhongMaterial</code> 类用于实现Blinn-Phong材质。
 */
export declare class BlinnPhongMaterial extends Material {
    /**高光强度数据源_漫反射贴图的Alpha通道。*/
    static SPECULARSOURCE_DIFFUSEMAPALPHA: number;
    /**高光强度数据源_高光贴图的RGB通道。*/
    static SPECULARSOURCE_SPECULARMAP: number;
    /**渲染状态_不透明。*/
    static RENDERMODE_OPAQUE: number;
    /**渲染状态_阿尔法测试。*/
    static RENDERMODE_CUTOUT: number;
    /**渲染状态_透明混合。*/
    static RENDERMODE_TRANSPARENT: number;
    static SHADERDEFINE_DIFFUSEMAP: ShaderDefine;
    static SHADERDEFINE_NORMALMAP: ShaderDefine;
    static SHADERDEFINE_SPECULARMAP: ShaderDefine;
    static SHADERDEFINE_TILINGOFFSET: ShaderDefine;
    static SHADERDEFINE_ENABLEVERTEXCOLOR: ShaderDefine;
    static ALBEDOTEXTURE: number;
    static NORMALTEXTURE: number;
    static SPECULARTEXTURE: number;
    static ALBEDOCOLOR: number;
    static MATERIALSPECULAR: number;
    static SHININESS: number;
    static TILINGOFFSET: number;
    static CULL: number;
    static BLEND: number;
    static BLEND_SRC: number;
    static BLEND_DST: number;
    static DEPTH_TEST: number;
    static DEPTH_WRITE: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: BlinnPhongMaterial;
    private _albedoColor;
    private _albedoIntensity;
    private _enableLighting;
    private _enableVertexColor;
    set _ColorR(value: number);
    set _ColorG(value: number);
    set _ColorB(value: number);
    set _ColorA(value: number);
    set _SpecColorR(value: number);
    set _SpecColorG(value: number);
    set _SpecColorB(value: number);
    set _SpecColorA(value: number);
    set _AlbedoIntensity(value: number);
    set _Shininess(value: number);
    set _MainTex_STX(x: number);
    set _MainTex_STY(y: number);
    set _MainTex_STZ(z: number);
    set _MainTex_STW(w: number);
    set _Cutoff(value: number);
    /**
     * 设置渲染模式。
     */
    set renderMode(value: number);
    /**
     * 是否支持顶点色。
     */
    get enableVertexColor(): boolean;
    set enableVertexColor(value: boolean);
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
     * 反照率颜色R分量。
     */
    get albedoColorR(): number;
    set albedoColorR(value: number);
    /**
     * 反照率颜色G分量。
     */
    get albedoColorG(): number;
    set albedoColorG(value: number);
    /**
     * 反照率颜色B分量。
     */
    get albedoColorB(): number;
    set albedoColorB(value: number);
    /**
     * 反照率颜色Z分量。
     */
    get albedoColorA(): number;
    set albedoColorA(value: number);
    /**
     * 反照率颜色。
     */
    get albedoColor(): Vector4;
    set albedoColor(value: Vector4);
    /**
     * 反照率强度。
     */
    get albedoIntensity(): number;
    set albedoIntensity(value: number);
    /**
     * 高光颜色R轴分量。
     */
    get specularColorR(): number;
    set specularColorR(value: number);
    /**
     * 高光颜色G分量。
     */
    get specularColorG(): number;
    set specularColorG(value: number);
    /**
     * 高光颜色B分量。
     */
    get specularColorB(): number;
    set specularColorB(value: number);
    /**
     * 高光颜色A分量。
     */
    get specularColorA(): number;
    set specularColorA(value: number);
    /**
     * 高光颜色。
     */
    get specularColor(): Vector4;
    set specularColor(value: Vector4);
    /**
     * 高光强度,范围为0到1。
     */
    get shininess(): number;
    set shininess(value: number);
    /**
     * 反照率贴图。
     */
    get albedoTexture(): BaseTexture;
    set albedoTexture(value: BaseTexture);
    /**
     * 法线贴图。
     */
    get normalTexture(): BaseTexture;
    set normalTexture(value: BaseTexture);
    /**
     * 高光贴图。
     */
    get specularTexture(): BaseTexture;
    set specularTexture(value: BaseTexture);
    /**
     * 是否启用光照。
     */
    get enableLighting(): boolean;
    set enableLighting(value: boolean);
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
     * 创建一个 <code>BlinnPhongMaterial</code> 实例。
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
