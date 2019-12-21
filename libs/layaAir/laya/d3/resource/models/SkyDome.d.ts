import { SkyMesh } from "./SkyMesh";
/**
 * <code>SkyDome</code> 类用于创建天空盒。
 */
export declare class SkyDome extends SkyMesh {
    static instance: SkyDome;
    /**
     * 获取堆数。
     */
    get stacks(): number;
    /**
     * 获取层数。
     */
    get slices(): number;
    /**
     * 创建一个 <code>SkyDome</code> 实例。
     * @param stacks 堆数。
     * @param slices 层数。
     */
    constructor(stacks?: number, slices?: number);
}
