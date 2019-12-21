import { PostProcess } from "../component/PostProcess";
import { BoundFrustum } from "../math/BoundFrustum";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Ray } from "../math/Ray";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import { Vector4 } from "../math/Vector4";
import { Viewport } from "../math/Viewport";
import { RenderTexture } from "../resource/RenderTexture";
import { Shader3D } from "../shader/Shader3D";
import { BaseCamera } from "./BaseCamera";
import { CommandBuffer } from "./render/command/CommandBuffer";
/**
 * 相机清除标记。
 */
export declare enum CameraClearFlags {
    /**固定颜色。*/
    SolidColor = 0,
    /**天空。*/
    Sky = 1,
    /**仅深度。*/
    DepthOnly = 2,
    /**不清除。*/
    Nothing = 3
}
/**
 * <code>Camera</code> 类用于创建摄像机。
 */
export declare class Camera extends BaseCamera {
    /**是否允许渲染。*/
    enableRender: boolean;
    /**清除标记。*/
    clearFlag: CameraClearFlags;
    /**
     * 横纵比。
     */
    get aspectRatio(): number;
    set aspectRatio(value: number);
    /**
     * 获取屏幕像素坐标的视口。
     */
    get viewport(): Viewport;
    set viewport(value: Viewport);
    /**
     * 裁剪空间的视口。
     */
    get normalizedViewport(): Viewport;
    set normalizedViewport(value: Viewport);
    /**
     * 获取视图矩阵。
     */
    get viewMatrix(): Matrix4x4;
    /**
     * 投影矩阵。
     */
    get projectionMatrix(): Matrix4x4;
    set projectionMatrix(value: Matrix4x4);
    /**
     * 获取视图投影矩阵。
     */
    get projectionViewMatrix(): Matrix4x4;
    /**
     * 获取摄像机视锥。
     */
    get boundFrustum(): BoundFrustum;
    /**
     * 自定义渲染场景的渲染目标。
     */
    get renderTarget(): RenderTexture;
    set renderTarget(value: RenderTexture);
    /**
     * 后期处理。
     */
    get postProcess(): PostProcess;
    set postProcess(value: PostProcess);
    /**
     * 是否开启HDR。
     * 开启后对性能有一定影响。
     */
    get enableHDR(): boolean;
    set enableHDR(value: boolean);
    /**
     * 创建一个 <code>Camera</code> 实例。
     * @param	aspectRatio 横纵比。
     * @param	nearPlane 近裁面。
     * @param	farPlane 远裁面。
     */
    constructor(aspectRatio?: number, nearPlane?: number, farPlane?: number);
    /**
     *	通过蒙版值获取蒙版是否显示。
     * 	@param  layer 层。
     * 	@return 是否显示。
     */
    _isLayerVisible(layer: number): boolean;
    /**
     * @override
     * @param shader 着色器
     * @param replacementTag 替换标记。
     */
    render(shader?: Shader3D, replacementTag?: string): void;
    /**
     * 计算从屏幕空间生成的射线。
     * @param point 屏幕空间的位置位置。
     * @param out  输出射线。
     */
    viewportPointToRay(point: Vector2, out: Ray): void;
    /**
     * 计算从裁切空间生成的射线。
     * @param point 裁切空间的位置。
     * @param out  输出射线。
     */
    normalizedViewportPointToRay(point: Vector2, out: Ray): void;
    /**
     * 将一个点从世界空间转换到视口空间。
     * @param position 世界空间的坐标。
     * @param out  x、y、z为视口空间坐标,w为相对于摄像机的z轴坐标。
     */
    worldToViewportPoint(position: Vector3, out: Vector4): void;
    /**
     * 将一个点从世界空间转换到归一化视口空间。
     * @param position 世界空间的坐标。
     * @param out  x、y、z为归一化视口空间坐标,w为相对于摄像机的z轴坐标。
     */
    worldToNormalizedViewportPoint(position: Vector3, out: Vector4): void;
    /**
     * 转换2D屏幕坐标系统到3D正交投影下的坐标系统，注:只有正交模型下有效。
     * @param   source 源坐标。
     * @param   out 输出坐标。
     * @return 是否转换成功。
     */
    convertScreenCoordToOrthographicCoord(source: Vector3, out: Vector3): boolean;
    /**
     * @inheritDoc
     * @override
     */
    destroy(destroyChild?: boolean): void;
    /**
     * 在特定渲染管线阶段添加指令缓存。
     */
    addCommandBuffer(event: number, commandBuffer: CommandBuffer): void;
    /**
     * 在特定渲染管线阶段移除指令缓存。
     */
    removeCommandBuffer(event: number, commandBuffer: CommandBuffer): void;
    /**
     * 在特定渲染管线阶段移除所有指令缓存。
     */
    removeCommandBuffers(event: number): void;
}
