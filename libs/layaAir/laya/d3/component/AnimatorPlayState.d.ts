import { AnimatorState } from "./AnimatorState";
/**
 * <code>AnimatorPlayState</code> 类用于创建动画播放状态信息。
 */
export declare class AnimatorPlayState {
    /**
     * 获取播放状态的归一化时间,整数为循环次数，小数为单次播放时间。
     */
    get normalizedTime(): number;
    /**
     * 获取当前动画的持续时间，以秒为单位。
     */
    get duration(): number;
    /**
     * 动画状态机。
     */
    get animatorState(): AnimatorState;
    /**
     * 创建一个 <code>AnimatorPlayState</code> 实例。
     */
    constructor();
}
