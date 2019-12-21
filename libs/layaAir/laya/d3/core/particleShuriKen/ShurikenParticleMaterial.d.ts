import { Material } from "../material/Material";
import { Vector4 } from "../../math/Vector4";
import { BaseTexture } from "../../../resource/BaseTexture";
import { ShaderDefine } from "../../shader/ShaderDefine";
/**
 * <code>ShurikenParticleMaterial</code> 类用于实现粒子材质。
 */
export declare class ShurikenParticleMaterial extends Material {
    /**渲染状态_透明混合。*/
    static RENDERMODE_ALPHABLENDED: number;
    /**渲染状态_加色法混合。*/
    static RENDERMODE_ADDTIVE: number;
    static SHADERDEFINE_DIFFUSEMAP: ShaderDefine;
    static SHADERDEFINE_TINTCOLOR: ShaderDefine;
    static SHADERDEFINE_TILINGOFFSET: ShaderDefine;
    static SHADERDEFINE_ADDTIVEFOG: ShaderDefine;
    static DIFFUSETEXTURE: number;
    static TINTCOLOR: number;
    static TILINGOFFSET: number;
    static CULL: number;
    static BLEND: number;
    static BLEND_SRC: number;
    static BLEND_DST: number;
    static DEPTH_TEST: number;
    static DEPTH_WRITE: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: ShurikenParticleMaterial;
    /**
     * 渲染模式。
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
     * 颜色Z分量。
     */
    get colorA(): number;
    set colorA(value: number);
    /**
     * 颜色。
     */
    get color(): Vector4;
    set color(value: Vector4);
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
     * 漫反射贴图。
     */
    get texture(): BaseTexture;
    set texture(value: BaseTexture);
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
