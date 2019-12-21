import { Vector4 } from "../../math/Vector4";
import { TextureCube } from "../../resource/TextureCube";
import { Material } from "./Material";
/**
 * <code>SkyBoxMaterial</code> 类用于实现SkyBoxMaterial材质。
 */
export declare class SkyBoxMaterial extends Material {
    static TINTCOLOR: number;
    static EXPOSURE: number;
    static ROTATION: number;
    static TEXTURECUBE: number;
    /** 默认材质，禁止修改*/
    static defaultMaterial: SkyBoxMaterial;
    /**
     * 颜色。
     */
    get tintColor(): Vector4;
    set tintColor(value: Vector4);
    /**
     * 曝光强度。
     */
    get exposure(): number;
    set exposure(value: number);
    /**
     * 曝光强度。
     */
    get rotation(): number;
    set rotation(value: number);
    /**
     * 天空盒纹理。
     */
    get textureCube(): TextureCube;
    set textureCube(value: TextureCube);
    /**
     * 克隆。
     * @return	 克隆副本。
     * @override
     */
    clone(): any;
    /**
     * 创建一个 <code>SkyBoxMaterial</code> 实例。
     */
    constructor();
}
