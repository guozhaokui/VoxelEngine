import { EventDispatcher } from "../../events/EventDispatcher";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { Sprite3D } from "./Sprite3D";
/**
 * <code>Transform3D</code> 类用于实现3D变换。
 */
export declare class Transform3D extends EventDispatcher {
    /**
     * 获取所属精灵。
     */
    get owner(): Sprite3D;
    /**
     * 获取世界矩阵是否需要更新。
     * @return	世界矩阵是否需要更新。
     */
    get worldNeedUpdate(): boolean;
    /**
     * 获取局部位置X轴分量。
     * @return	局部位置X轴分量。
     */
    get localPositionX(): number;
    /**
     * 设置局部位置X轴分量。
     * @param x	局部位置X轴分量。
     */
    set localPositionX(x: number);
    /**
     * 获取局部位置Y轴分量。
     * @return	局部位置Y轴分量。
     */
    get localPositionY(): number;
    /**
     * 设置局部位置Y轴分量。
     * @param y	局部位置Y轴分量。
     */
    set localPositionY(y: number);
    /**
     * 获取局部位置Z轴分量。
     * @return	局部位置Z轴分量。
     */
    get localPositionZ(): number;
    /**
     * 设置局部位置Z轴分量。
     * @param z	局部位置Z轴分量。
     */
    set localPositionZ(z: number);
    /**
     * 获取局部位置。
     * @return	局部位置。
     */
    get localPosition(): Vector3;
    /**
     * 设置局部位置。
     * @param value	局部位置。
     */
    set localPosition(value: Vector3);
    /**
     * 获取局部旋转四元数X分量。
     * @return	局部旋转四元数X分量。
     */
    get localRotationX(): number;
    /**
     * 设置局部旋转四元数X分量。
     * @param x	局部旋转四元数X分量。
     */
    set localRotationX(x: number);
    /**
     * 获取局部旋转四元数Y分量。
     * @return	局部旋转四元数Y分量。
     */
    get localRotationY(): number;
    /**
     * 设置局部旋转四元数Y分量。
     * @param y	局部旋转四元数Y分量。
     */
    set localRotationY(y: number);
    /**
     * 获取局部旋转四元数Z分量。
     * @return	局部旋转四元数Z分量。
     */
    get localRotationZ(): number;
    /**
     * 设置局部旋转四元数Z分量。
     * @param z	局部旋转四元数Z分量。
     */
    set localRotationZ(z: number);
    /**
     * 获取局部旋转四元数W分量。
     * @return	局部旋转四元数W分量。
     */
    get localRotationW(): number;
    /**
     * 设置局部旋转四元数W分量。
     * @param w	局部旋转四元数W分量。
     */
    set localRotationW(w: number);
    /**
     * 获取局部旋转。
     * @return	局部旋转。
     */
    get localRotation(): Quaternion;
    /**
     * 设置局部旋转。
     * @param value	局部旋转。
     */
    set localRotation(value: Quaternion);
    /**
     * 获取局部缩放X。
     * @return	局部缩放X。
     */
    get localScaleX(): number;
    /**
     * 设置局部缩放X。
     * @param	value 局部缩放X。
     */
    set localScaleX(value: number);
    /**
     * 获取局部缩放Y。
     * @return	局部缩放Y。
     */
    get localScaleY(): number;
    /**
     * 设置局部缩放Y。
     * @param	value 局部缩放Y。
     */
    set localScaleY(value: number);
    /**
     * 获取局部缩放Z。
     * @return	局部缩放Z。
     */
    get localScaleZ(): number;
    /**
     * 设置局部缩放Z。
     * @param	value 局部缩放Z。
     */
    set localScaleZ(value: number);
    /**
     * 获取局部缩放。
     * @return	局部缩放。
     */
    get localScale(): Vector3;
    /**
     * 设置局部缩放。
     * @param	value 局部缩放。
     */
    set localScale(value: Vector3);
    /**
     * 获取局部空间的X轴欧拉角。
     * @return	局部空间的X轴欧拉角。
     */
    get localRotationEulerX(): number;
    /**
     * 设置局部空间的X轴欧拉角。
     * @param	value 局部空间的X轴欧拉角。
     */
    set localRotationEulerX(value: number);
    /**
     * 获取局部空间的Y轴欧拉角。
     * @return	局部空间的Y轴欧拉角。
     */
    get localRotationEulerY(): number;
    /**
     * 设置局部空间的Y轴欧拉角。
     * @param	value 局部空间的Y轴欧拉角。
     */
    set localRotationEulerY(value: number);
    /**
     * 获取局部空间的Z轴欧拉角。
     * @return	局部空间的Z轴欧拉角。
     */
    get localRotationEulerZ(): number;
    /**
     * 设置局部空间的Z轴欧拉角。
     * @param	value 局部空间的Z轴欧拉角。
     */
    set localRotationEulerZ(value: number);
    /**
     * 获取局部空间欧拉角。
     * @return	欧拉角的旋转值。
     */
    get localRotationEuler(): Vector3;
    /**
     * 设置局部空间的欧拉角。
     * @param	value 欧拉角的旋转值。
     */
    set localRotationEuler(value: Vector3);
    /**
     * 获取局部矩阵。
     * @return	局部矩阵。
     */
    get localMatrix(): Matrix4x4;
    /**
     * 设置局部矩阵。
     * @param value	局部矩阵。
     */
    set localMatrix(value: Matrix4x4);
    /**
     * 获取世界位置。
     * @return	世界位置。
     */
    get position(): Readonly<Vector3>;
    /**
     * 设置世界位置。
     * @param	value 世界位置。
     */
    set position(value: Readonly<Vector3>);
    /**
     * 获取世界旋转。
     * @return	世界旋转。
     */
    get rotation(): Quaternion;
    /**
     * 设置世界旋转。
     * @param value	世界旋转。
     */
    set rotation(value: Quaternion);
    /**
     * 获取世界空间的旋转角度。
     * @return	欧拉角的旋转值，顺序为x、y、z。
     */
    get rotationEuler(): Vector3;
    /**
     * 设置世界空间的旋转角度。
     * @param	欧拉角的旋转值，顺序为x、y、z。
     */
    set rotationEuler(value: Vector3);
    /**
     * 获取世界矩阵。
     * @return	世界矩阵。
     */
    get worldMatrix(): Matrix4x4;
    /**
     * 设置世界矩阵。
     * @param	value 世界矩阵。
     */
    set worldMatrix(value: Matrix4x4);
    /**
     * 创建一个 <code>Transform3D</code> 实例。
     * @param owner 所属精灵。
     */
    constructor(owner: Sprite3D);
    /**
     * 平移变换。
     * @param 	translation 移动距离。
     * @param 	isLocal 是否局部空间。
     */
    translate(translation: Vector3, isLocal?: boolean): void;
    /**
     * 旋转变换。
     * @param 	rotations 旋转幅度。
     * @param 	isLocal 是否局部空间。
     * @param 	isRadian 是否弧度制。
     */
    rotate(rotation: Vector3, isLocal?: boolean, isRadian?: boolean): void;
    /**
     * 获取向前方向。
     * @param 前方向。
     */
    getForward(forward: Vector3): void;
    /**
     * 获取向上方向。
     * @param 上方向。
     */
    getUp(up: Vector3): void;
    /**
     * 获取向右方向。
     * @param 右方向。
     */
    getRight(right: Vector3): void;
    /**
     * 观察目标位置。
     * @param	target 观察目标。
     * @param	up 向上向量。
     * @param	isLocal 是否局部空间。
     */
    lookAt(target: Vector3, up: Vector3, isLocal?: boolean): void;
    /**
     * 世界缩放。
     * 某种条件下获取该值可能不正确（例如：父节点有缩放，子节点有旋转），缩放会倾斜，无法使用Vector3正确表示,必须使用Matrix3x3矩阵才能正确表示。
     * @return	世界缩放。
     */
    getWorldLossyScale(): Vector3;
    /**
     * 设置世界缩放。
     * 某种条件下设置该值可能不正确（例如：父节点有缩放，子节点有旋转），缩放会倾斜，无法使用Vector3正确表示,必须使用Matrix3x3矩阵才能正确表示。
     * @return	世界缩放。
     */
    setWorldLossyScale(value: Vector3): void;
    /**
     * @deprecated
     */
    get scale(): Vector3;
    /**
     * @deprecated
     */
    set scale(value: Vector3);
}
