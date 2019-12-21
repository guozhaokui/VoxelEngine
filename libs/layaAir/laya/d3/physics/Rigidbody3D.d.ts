import { Vector3 } from "../math/Vector3";
import { PhysicsTriggerComponent } from "./PhysicsTriggerComponent";
/**
 * <code>Rigidbody3D</code> 类用于创建刚体碰撞器。
 */
export declare class Rigidbody3D extends PhysicsTriggerComponent {
    static TYPE_STATIC: number;
    static TYPE_DYNAMIC: number;
    static TYPE_KINEMATIC: number;
    /**
     * 质量。
     */
    get mass(): number;
    set mass(value: number);
    /**
     * 是否为运动物体，如果为true仅可通过transform属性移动物体,而非其他力相关属性。
     */
    get isKinematic(): boolean;
    set isKinematic(value: boolean);
    /**
     * 刚体的线阻力。
     */
    get linearDamping(): number;
    set linearDamping(value: number);
    /**
     * 刚体的角阻力。
     */
    get angularDamping(): number;
    set angularDamping(value: number);
    /**
     * 是否重载重力。
     */
    get overrideGravity(): boolean;
    set overrideGravity(value: boolean);
    /**
     * 重力。
     */
    get gravity(): Vector3;
    set gravity(value: Vector3);
    /**
     * 总力。
     */
    get totalForce(): Vector3;
    /**
     * 每个轴的线性运动缩放因子,如果某一轴的值为0表示冻结在该轴的线性运动。
     */
    get linearFactor(): Vector3;
    set linearFactor(value: Vector3);
    /**
     * 线速度
     */
    get linearVelocity(): Vector3;
    set linearVelocity(value: Vector3);
    /**
     * 每个轴的角度运动缩放因子,如果某一轴的值为0表示冻结在该轴的角度运动。
     */
    get angularFactor(): Vector3;
    set angularFactor(value: Vector3);
    /**
     * 角速度。
     */
    get angularVelocity(): Vector3;
    set angularVelocity(value: Vector3);
    /**
     * 刚体所有扭力。
     */
    get totalTorque(): Vector3;
    /**
     * 是否进行碰撞检测。
     */
    get detectCollisions(): boolean;
    set detectCollisions(value: boolean);
    /**
     * 是否处于睡眠状态。
     */
    get isSleeping(): boolean;
    /**
     * 刚体睡眠的线速度阈值。
     */
    get sleepLinearVelocity(): number;
    set sleepLinearVelocity(value: number);
    /**
     * 刚体睡眠的角速度阈值。
     */
    get sleepAngularVelocity(): number;
    set sleepAngularVelocity(value: number);
    /**
     * 创建一个 <code>RigidBody3D</code> 实例。
     * @param collisionGroup 所属碰撞组。
     * @param canCollideWith 可产生碰撞的碰撞组。
     */
    constructor(collisionGroup?: number, canCollideWith?: number);
    /**
     * 应用作用力。
     * @param	force 作用力。
     * @param	localOffset 偏移,如果为null则为中心点
     */
    applyForce(force: Vector3, localOffset?: Vector3): void;
    /**
     * 应用扭转力。
     * @param	torque 扭转力。
     */
    applyTorque(torque: Vector3): void;
    /**
     * 应用冲量。
     * @param	impulse 冲量。
     * @param   localOffset 偏移,如果为null则为中心点。
     */
    applyImpulse(impulse: Vector3, localOffset?: Vector3): void;
    /**
     * 应用扭转冲量。
     * @param	torqueImpulse
     */
    applyTorqueImpulse(torqueImpulse: Vector3): void;
    /**
     * 唤醒刚体。
     */
    wakeUp(): void;
    /**
     *清除应用到刚体上的所有力。
     */
    clearForces(): void;
}
