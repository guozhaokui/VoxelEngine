import { PhysicsComponent } from "./PhysicsComponent";
/**
 * <code>PhysicsTriggerComponent</code> 类用于创建物理触发器组件。
 */
export declare class PhysicsTriggerComponent extends PhysicsComponent {
    /**
     * 是否为触发器。
     */
    get isTrigger(): boolean;
    set isTrigger(value: boolean);
    /**
     * 创建一个 <code>PhysicsTriggerComponent</code> 实例。
     * @param collisionGroup 所属碰撞组。
     * @param canCollideWith 可产生碰撞的碰撞组。
     */
    constructor(collisionGroup: number, canCollideWith: number);
}
