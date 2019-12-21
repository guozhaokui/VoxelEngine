import { Vector3 } from "../math/Vector3";
import { PhysicsComponent } from "./PhysicsComponent";
/**
 * <code>CharacterController</code> 类用于创建角色控制器。
 */
export declare class CharacterController extends PhysicsComponent {
    static UPAXIS_X: number;
    static UPAXIS_Y: number;
    static UPAXIS_Z: number;
    /**
     * 角色降落速度。
     */
    get fallSpeed(): number;
    set fallSpeed(value: number);
    /**
     * 角色跳跃速度。
     */
    get jumpSpeed(): number;
    set jumpSpeed(value: number);
    /**
     * 重力。
     */
    get gravity(): Vector3;
    set gravity(value: Vector3);
    /**
     * 最大坡度。
     */
    get maxSlope(): number;
    set maxSlope(value: number);
    /**
     * 角色是否在地表。
     */
    get isGrounded(): boolean;
    /**
     * 角色行走的脚步高度，表示可跨越的最大高度。
     */
    get stepHeight(): number;
    set stepHeight(value: number);
    /**
     * 角色的Up轴。
     */
    get upAxis(): Vector3;
    set upAxis(value: Vector3);
    /**
     * 创建一个 <code>CharacterController</code> 实例。
     * @param stepheight 角色脚步高度。
     * @param upAxis 角色Up轴
     * @param collisionGroup 所属碰撞组。
     * @param canCollideWith 可产生碰撞的碰撞组。
     */
    constructor(stepheight?: number, upAxis?: Vector3, collisionGroup?: number, canCollideWith?: number);
    /**
     * 通过指定移动向量移动角色。
     * @param	movement 移动向量。
     */
    move(movement: Vector3): void;
    /**
     * 跳跃。
     * @param velocity 跳跃速度。
     */
    jump(velocity?: Vector3): void;
}
