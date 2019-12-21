import { Component } from "../../components/Component";
import { PhysicsSimulation } from "./PhysicsSimulation";
import { ColliderShape } from "./shape/ColliderShape";
/**
 * <code>PhysicsComponent</code> 类用于创建物理组件的父类。
 */
export declare class PhysicsComponent extends Component {
    /** 是否可以缩放Shape。 */
    canScaleShape: boolean;
    /**
     * 弹力。
     */
    get restitution(): number;
    set restitution(value: number);
    /**
     * 摩擦力。
     */
    get friction(): number;
    set friction(value: number);
    /**
     * 滚动摩擦力。
     */
    get rollingFriction(): number;
    set rollingFriction(value: number);
    /**
     * 用于连续碰撞检测(CCD)的速度阈值,当物体移动速度小于该值时不进行CCD检测,防止快速移动物体(例如:子弹)错误的穿过其它物体,0表示禁止。
     */
    get ccdMotionThreshold(): number;
    set ccdMotionThreshold(value: number);
    /**
     * 获取用于进入连续碰撞检测(CCD)范围的球半径。
     */
    get ccdSweptSphereRadius(): number;
    set ccdSweptSphereRadius(value: number);
    /**
     * 获取是否激活。
     */
    get isActive(): boolean;
    /**
     * @inheritDoc
     * @override
     */
    get enabled(): boolean;
    /**
     * @inheritDoc
     * @override
     */
    set enabled(value: boolean);
    /**
     * 碰撞形状。
     */
    get colliderShape(): ColliderShape;
    set colliderShape(value: ColliderShape);
    /**
     * 模拟器。
     */
    get simulation(): PhysicsSimulation;
    /**
     * 所属碰撞组。
     */
    get collisionGroup(): number;
    set collisionGroup(value: number);
    /**
     * 可碰撞的碰撞组。
     */
    get canCollideWith(): number;
    set canCollideWith(value: number);
    /**
     * 创建一个 <code>PhysicsComponent</code> 实例。
     * @param collisionGroup 所属碰撞组。
     * @param canCollideWith 可产生碰撞的碰撞组。
     */
    constructor(collisionGroup: number, canCollideWith: number);
}
