import { Material } from "../../core/material/Material";
import { SkyMesh } from "./SkyMesh";
/**
 * <code>SkyRenderer</code> 类用于实现天空渲染器。
 */
export declare class SkyRenderer {
    /**
     * 材质。
     */
    get material(): Material;
    set material(value: Material);
    /**
     * 网格。
     */
    get mesh(): SkyMesh;
    set mesh(value: SkyMesh);
    /**
     * 创建一个新的 <code>SkyRenderer</code> 实例。
     */
    constructor();
}
