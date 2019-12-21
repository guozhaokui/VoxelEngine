import { Matrix } from "../../maths/Matrix";
import { Mesh2D } from "./Mesh2D";
/**
 * 与MeshQuadTexture基本相同。不过index不是固定的
 */
export declare class MeshTexture extends Mesh2D {
    static const_stride: number;
    private static _fixattriInfo;
    private static _POOL;
    static __init__(): void;
    constructor();
    /**
     *
     */
    static getAMesh(mainctx: boolean): MeshTexture;
    addData(vertices: Float32Array, uvs: Float32Array, idx: Uint16Array, matrix: Matrix, rgba: number): void;
    /**
     * 把本对象放到回收池中，以便getMesh能用。
     * @override
     */
    releaseMesh(): void;
    /**
     * @override
     */
    destroy(): void;
}
