import { AnimationClip } from "../animation/AnimationClip";
import { AnimatorStateScript } from "../animation/AnimatorStateScript";
import { IClone } from "../core/IClone";
import { IReferenceCounter } from "../resource/IReferenceCounter";
/**
 * <code>AnimatorState</code> 类用于创建动作状态。
 */
export declare class AnimatorState implements IReferenceCounter, IClone {
    /**名称。*/
    name: string;
    /**动画播放速度,1.0为正常播放速度。*/
    speed: number;
    /**动作播放起始时间。*/
    clipStart: number;
    /**动作播放结束时间。*/
    clipEnd: number;
    /**
     * 动作。
     */
    get clip(): AnimationClip;
    set clip(value: AnimationClip);
    /**
     * 创建一个 <code>AnimatorState</code> 实例。
     */
    constructor();
    /**
     * @implements IReferenceCounter
     */
    _getReferenceCount(): number;
    /**
     * @implements IReferenceCounter
     */
    _addReference(count?: number): void;
    /**
     * @implements IReferenceCounter
     */
    _removeReference(count?: number): void;
    /**
     * @implements IReferenceCounter
     */
    _clearReference(): void;
    /**
     * 添加脚本。
     * @param	type  组件类型。
     * @return 脚本。
     *
     */
    addScript(type: typeof AnimatorStateScript): AnimatorStateScript;
    /**
     * 获取脚本。
     * @param	type  组件类型。
     * @return 脚本。
     *
     */
    getScript(type: typeof AnimatorStateScript): AnimatorStateScript;
    /**
     * 获取脚本集合。
     * @param	type  组件类型。
     * @return 脚本集合。
     *
     */
    getScripts(type: typeof AnimatorStateScript): AnimatorStateScript[];
    /**
     * 克隆。
     * @param	destObject 克隆源。
     */
    cloneTo(destObject: any): void;
    /**
     * 克隆。
     * @return	 克隆副本。
     */
    clone(): any;
}
