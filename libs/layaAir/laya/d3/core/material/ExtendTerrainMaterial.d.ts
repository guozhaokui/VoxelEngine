import { BaseTexture } from "../../../resource/BaseTexture";
import { Vector4 } from "../../math/Vector4";
import { Material } from "./Material";
import { ShaderDefine } from "../../shader/ShaderDefine";
/**
 * ...
 * @author ...
 */
export declare class ExtendTerrainMaterial extends Material {
    /**渲染状态_不透明。*/
    static RENDERMODE_OPAQUE: number;
    /**渲染状态_透明混合。*/
    static RENDERMODE_TRANSPARENT: number;
    /**渲染状态_透明混合。*/
    static SPLATALPHATEXTURE: number;
    static DIFFUSETEXTURE1: number;
    static DIFFUSETEXTURE2: number;
    static DIFFUSETEXTURE3: number;
    static DIFFUSETEXTURE4: number;
    static DIFFUSETEXTURE5: number;
    static DIFFUSESCALEOFFSET1: number;
    static DIFFUSESCALEOFFSET2: number;
    static DIFFUSESCALEOFFSET3: number;
    static DIFFUSESCALEOFFSET4: number;
    static DIFFUSESCALEOFFSET5: number;
    static CULL: number;
    static BLEND: number;
    static BLEND_SRC: number;
    static BLEND_DST: number;
    static DEPTH_TEST: number;
    static DEPTH_WRITE: number;
    /**地形细节宏定义。*/
    static SHADERDEFINE_DETAIL_NUM1: ShaderDefine;
    static SHADERDEFINE_DETAIL_NUM2: ShaderDefine;
    static SHADERDEFINE_DETAIL_NUM3: ShaderDefine;
    static SHADERDEFINE_DETAIL_NUM4: ShaderDefine;
    static SHADERDEFINE_DETAIL_NUM5: ShaderDefine;
    /**
     * splatAlpha贴图。
     */
    get splatAlphaTexture(): BaseTexture;
    set splatAlphaTexture(value: BaseTexture);
    /**
     * 第一层贴图。
     */
    get diffuseTexture1(): BaseTexture;
    set diffuseTexture1(value: BaseTexture);
    /**
     * 第二层贴图。
     */
    get diffuseTexture2(): BaseTexture;
    set diffuseTexture2(value: BaseTexture);
    /**
     * 第三层贴图。
     */
    get diffuseTexture3(): BaseTexture;
    set diffuseTexture3(value: BaseTexture);
    /**
     * 第四层贴图。
     */
    get diffuseTexture4(): BaseTexture;
    set diffuseTexture4(value: BaseTexture);
    /**
     * 第五层贴图。
     */
    get diffuseTexture5(): BaseTexture;
    set diffuseTexture5(value: BaseTexture);
    /**
     * 第一层贴图缩放偏移。
     */
    set diffuseScaleOffset1(scaleOffset1: Vector4);
    /**
     * 第二层贴图缩放偏移。
     */
    set diffuseScaleOffset2(scaleOffset2: Vector4);
    /**
     * 第三层贴图缩放偏移。
     */
    set diffuseScaleOffset3(scaleOffset3: Vector4);
    /**
     * 第四层贴图缩放偏移。
     */
    set diffuseScaleOffset4(scaleOffset4: Vector4);
    /**
     * 第五层贴图缩放偏移。
     */
    set diffuseScaleOffset5(scaleOffset5: Vector4);
    /**
     * 是否启用光照。
     */
    get enableLighting(): boolean;
    set enableLighting(value: boolean);
    /**
     * 设置渲染模式。
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
