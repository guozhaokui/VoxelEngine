import { BaseTexture } from "../../../resource/BaseTexture";
import { Vector4 } from "../../math/Vector4";
import { ShaderDefine } from "../../shader/ShaderDefine";
import { Material } from "./Material";
/**
 * <code>UnlitMaterial</code> 类用于实现不受光照影响的材质。
 */
export declare class UnlitMaterial extends Material {
    /**渲染状态_不透明。*/
    static RENDERMODE_OPAQUE: number;
    /**渲染状态_阿尔法测试。*/
    static RENDERMODE_CUTOUT: number;
    /**渲染状态__透明混合。*/
    static RENDERMODE_TRANSPARENT: number;
    /**渲染状态__加色法混合。*/
    static RENDERMODE_ADDTIVE: number;
    static SHADERDEFINE_ALBEDOTEXTURE: ShaderDefine;
    static SHADERDEFINE_TILINGOFFSET: ShaderDefine;
    static SHADERDEFINE_ENABLEVERTEXCOLOR: ShaderDefine;
    static ALBEDOTEXTURE: number;
    static ALBEDOCOLOR: number;
    static TILINGOFFSET: number;
    static CULL: number;
    static BLEND: number;
    static BLEND_SRC: number;
    static BLEND_DST: number;
    static DEPTH_TEST: number;
    static DEPTH_WRITE: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: UnlitMaterial;
    private _albedoColor;
    private _albedoIntensity;
    private _enableVertexColor;
    set _ColorR(value: number);
    set _ColorG(value: number);
    set _ColorB(value: number);
    set _ColorA(value: number);
    set _AlbedoIntensity(value: number);
    set _MainTex_STX(x: number);
    set _MainTex_STY(y: number);
    set _MainTex_STZ(z: number);
    set _MainTex_STW(w: number);
    set _Cutoff(value: number);
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
     * 反照率贴图。
     */
    get albedoTexture(): BaseTexture;
    set albedoTexture(value: BaseTexture);
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
     * 是否支持顶点色。
     */
    get enableVertexColor(): boolean;
    set enableVertexColor(value: boolean);
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
    constructor();
    /**
     * 克隆。
     * @return	 克隆副本。
     * @override
     */
    clone(): any;
}
