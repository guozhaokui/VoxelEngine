import { Component } from "../../components/Component";
import { Avatar } from "../core/Avatar";
import { Sprite3D } from "../core/Sprite3D";
import { AnimatorControllerLayer } from "./AnimatorControllerLayer";
import { AnimatorPlayState } from "./AnimatorPlayState";
import { AnimatorState } from "./AnimatorState";
/**
 * <code>Animator</code> 类用于创建动画组件。
 */
export declare class Animator extends Component {
    /** 裁剪模式_始终播放动画。*/
    static CULLINGMODE_ALWAYSANIMATE: number;
    /** 裁剪模式_不可见时完全不播放动画。*/
    static CULLINGMODE_CULLCOMPLETELY: number;
    /**	裁剪模式*/
    cullingMode: number;
    /**
     * 动画的播放速度,1.0为正常播放速度。
     */
    get speed(): number;
    set speed(value: number);
    /**
     * 创建一个 <code>Animation</code> 实例。
     */
    constructor();
    /**
     * 获取默认动画状态。
     * @param	layerIndex 层索引。
     * @return 默认动画状态。
     */
    getDefaultState(layerIndex?: number): AnimatorState;
    /**
     * 添加动画状态。
     * @param	state 动画状态。
     * @param   layerIndex 层索引。
     */
    addState(state: AnimatorState, layerIndex?: number): void;
    /**
     * 移除动画状态。
     * @param	state 动画状态。
     * @param   layerIndex 层索引。
     */
    removeState(state: AnimatorState, layerIndex?: number): void;
    /**
     * 添加控制器层。
     */
    addControllerLayer(controllderLayer: AnimatorControllerLayer): void;
    /**
     * 获取控制器层。
     */
    getControllerLayer(layerInex?: number): AnimatorControllerLayer;
    /**
     * 播放动画。
     * @param	name 如果为null则播放默认动画，否则按名字播放动画片段。
     * @param	layerIndex 层索引。
     * @param	normalizedTime 归一化的播放起始时间。
     */
    play(name?: string, layerIndex?: number, normalizedTime?: number): void;
    /**
     * 在当前动画状态和目标动画状态之间进行融合过渡播放。
     * @param	name 目标动画状态。
     * @param	transitionDuration 过渡时间,该值为当前动画状态的归一化时间，值在0.0~1.0之间。
     * @param	layerIndex 层索引。
     * @param	normalizedTime 归一化的播放起始时间。
     */
    crossFade(name: string, transitionDuration: number, layerIndex?: number, normalizedTime?: number): void;
    /**
     * @deprecated
     * 获取当前的播放状态。
     * @param   layerIndex 层索引。
     * @return  动画播放状态。
     */
    getCurrentAnimatorPlayState(layerInex?: number): AnimatorPlayState;
    /**
     * avatar。
     */
    get avatar(): Avatar;
    set avatar(value: Avatar);
    /**
     * 关联精灵节点到Avatar节点,此Animator必须有Avatar文件。
     * @param nodeName 关联节点的名字。
     * @param sprite3D 精灵节点。
     * @return 是否关联成功。
     */
    linkSprite3DToAvatarNode(nodeName: string, sprite3D: Sprite3D): boolean;
    /**
     * 解除精灵节点到Avatar节点的关联,此Animator必须有Avatar文件。
     * @param sprite3D 精灵节点。
     * @return 是否解除关联成功。
     */
    unLinkSprite3DToAvatarNode(sprite3D: Sprite3D): boolean;
}
