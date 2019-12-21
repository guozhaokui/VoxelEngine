import { BaseTexture } from "../../../resource/BaseTexture";
import { Vector4 } from "../../math/Vector4";
import { Material } from "./Material";
import { ShaderDefine } from "../../shader/ShaderDefine";
/**
 * <code>WaterPrimaryMaterial</code> 类用于实现水材质。
 */
export declare class WaterPrimaryMaterial extends Material {
    static HORIZONCOLOR: number;
    static MAINTEXTURE: number;
    static NORMALTEXTURE: number;
    static WAVESCALE: number;
    static WAVESPEED: number;
    static SHADERDEFINE_MAINTEXTURE: ShaderDefine;
    static SHADERDEFINE_NORMALTEXTURE: ShaderDefine;
    /** 默认材质，禁止修改*/
    static defaultMaterial: WaterPrimaryMaterial;
    /**
     * 地平线颜色。
     */
    get horizonColor(): Vector4;
    set horizonColor(value: Vector4);
    /**
     * 主贴图。
     */
    get mainTexture(): BaseTexture;
    set mainTexture(value: BaseTexture);
    /**
     * 法线贴图。
     */
    get normalTexture(): BaseTexture;
    set normalTexture(value: BaseTexture);
    /**
     * 波动缩放系数。
     */
    get waveScale(): number;
    set waveScale(value: number);
    /**
     * 波动速率。
     */
    get waveSpeed(): Vector4;
    set waveSpeed(value: Vector4);
    constructor();
    /**
     * 克隆。
     * @return	 克隆副本。
     * @override
     */
    clone(): any;
}
