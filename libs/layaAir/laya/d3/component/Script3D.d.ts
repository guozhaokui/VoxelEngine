import { Component } from "../../components/Component";
import { Collision } from "../physics/Collision";
import { PhysicsComponent } from "../physics/PhysicsComponent";
import { Event } from "../../events/Event";
/**
 * <code>Script3D</code> 类用于创建脚本的父类,该类为抽象类,不允许实例。
 */
export declare class Script3D extends Component {
    /**
     * @inheritDoc
     * @override
     */
    get isSingleton(): boolean;
    /**
     * 创建后只执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onAwake(): void;
    /**
     * 每次启动后执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onEnable(): void;
    /**
     * 第一次执行update之前执行，只会执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onStart(): void;
    /**
     * 开始触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerEnter(other: PhysicsComponent): void;
    /**
     * 持续触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerStay(other: PhysicsComponent): void;
    /**
     * 结束触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerExit(other: PhysicsComponent): void;
    /**
     * 开始碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionEnter(collision: Collision): void;
    /**
     * 持续碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionStay(collision: Collision): void;
    /**
     * 结束碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionExit(collision: Collision): void;
    /**
     * 鼠标按下时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseDown(): void;
    /**
     * 鼠标拖拽时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseDrag(): void;
    /**
     * 鼠标点击时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseClick(): void;
    /**
     * 鼠标弹起时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseUp(): void;
    /**
     * 鼠标进入时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseEnter(): void;
    /**
     * 鼠标经过时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseOver(): void;
    /**
     * 鼠标离开时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseOut(): void;
    /**
     * 键盘按下时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onKeyDown(e: Event): void;
    /**
     * 键盘产生一个字符时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onKeyPress(e: Event): void;
    /**
     * 键盘抬起时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onKeyUp(e: Event): void;
    /**
     * 每帧更新时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onUpdate(): void;
    /**
     * 每帧更新时执行，在update之后执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onLateUpdate(): void;
    /**
     * 渲染之前执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onPreRender(): void;
    /**
     * 渲染之后执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onPostRender(): void;
    /**
     * 禁用时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onDisable(): void;
    /**
     * 销毁时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onDestroy(): void;
}
