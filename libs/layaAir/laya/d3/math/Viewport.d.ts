import { Matrix4x4 } from "./Matrix4x4";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";
/**
 * <code>Viewport</code> 类用于创建视口。
 */
export declare class Viewport {
    /**X轴坐标*/
    x: number;
    /**Y轴坐标*/
    y: number;
    /**宽度*/
    width: number;
    /**高度*/
    height: number;
    /**最小深度*/
    minDepth: number;
    /**最大深度*/
    maxDepth: number;
    /**
     * 创建一个 <code>Viewport</code> 实例。
     * @param	x x坐标。
     * @param	y y坐标。
     * @param	width 宽度。
     * @param	height 高度。
     */
    constructor(x: number, y: number, width: number, height: number);
    /**
     * 投影一个三维向量到视口空间。
     * @param	source 三维向量。
     * @param	matrix 变换矩阵。
     * @param	out x、y、z为视口空间坐标,w为相对于变换矩阵的z轴坐标。
     */
    project(source: Vector3, matrix: Matrix4x4, out: Vector4): void;
    /**
     * 反变换一个三维向量。
     * @param	source 源三维向量。
     * @param	matrix 变换矩阵。
     * @param	out 输出三维向量。
     */
    unprojectFromMat(source: Vector3, matrix: Matrix4x4, out: Vector3): void;
    /**
     * 反变换一个三维向量。
     * @param	source 源三维向量。
     * @param	projection  透视投影矩阵。
     * @param	view 视图矩阵。
     * @param	world 世界矩阵,可设置为null。
     * @param   out 输出向量。
     */
    unprojectFromWVP(source: Vector3, projection: Matrix4x4, view: Matrix4x4, world: Matrix4x4, out: Vector3): void;
    /**
     * 克隆
     * @param	out
     */
    cloneTo(out: Viewport): void;
}
