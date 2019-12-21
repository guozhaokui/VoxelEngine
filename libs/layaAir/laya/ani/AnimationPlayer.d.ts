import { AnimationTemplet } from "./AnimationTemplet";
import { IDestroy } from "../resource/IDestroy";
import { EventDispatcher } from "../events/EventDispatcher";
/**开始播放时调度。
 * @eventType Event.PLAYED
 * */
/**暂停时调度。
 * @eventType Event.PAUSED
 * */
/**完成一次循环时调度。
 * @eventType Event.COMPLETE
 * */
/**停止时调度。
 * @eventType Event.STOPPED
 * */
/**
 * <code>AnimationPlayer</code> 类用于动画播放器。
 */
export declare class AnimationPlayer extends EventDispatcher implements IDestroy {
    /**是否缓存*/
    isCache: boolean;
    /** 播放速率*/
    playbackRate: number;
    /** 停止时是否归零*/
    returnToZeroStopped: boolean;
    /**
     * 获取动画数据模板
     * @param	value 动画数据模板
     */
    get templet(): AnimationTemplet;
    /**
     * 设置动画数据模板,注意：修改此值会有计算开销。
     * @param	value 动画数据模板
     */
    set templet(value: AnimationTemplet);
    /**
     * 动画播放的起始时间位置。
     * @return	 起始时间位置。
     */
    get playStart(): number;
    /**
     * 动画播放的结束时间位置。
     * @return	 结束时间位置。
     */
    get playEnd(): number;
    /**
     * 获取动画播放一次的总时间
     * @return	 动画播放一次的总时间
     */
    get playDuration(): number;
    /**
     * 获取动画播放的总总时间
     * @return	 动画播放的总时间
     */
    get overallDuration(): number;
    /**
     * 获取当前动画索引
     * @return	value 当前动画索引
     */
    get currentAnimationClipIndex(): number;
    /**
     * 获取当前帧数
     * @return	 当前帧数
     */
    get currentKeyframeIndex(): number;
    /**
     *  获取当前精确时间，不包括重播时间
     * @return	value 当前时间
     */
    get currentPlayTime(): number;
    /**
     *  获取当前帧时间，不包括重播时间
     * @return	value 当前时间
     */
    get currentFrameTime(): number;
    /**
     *  获取缓存播放速率。*
     * @return	 缓存播放速率。
     */
    get cachePlayRate(): number;
    /**
     *  设置缓存播放速率,默认值为1.0,注意：修改此值会有计算开销。*
     * @return	value 缓存播放速率。
     */
    set cachePlayRate(value: number);
    /**
     *  获取默认帧率*
     * @return	value 默认帧率
     */
    get cacheFrameRate(): number;
    /**
     *  设置默认帧率,每秒60帧,注意：修改此值会有计算开销。*
     * @return	value 缓存帧率
     */
    set cacheFrameRate(value: number);
    /**
     * 设置当前播放位置
     * @param	value 当前时间
     */
    set currentTime(value: number);
    /**
     * 获取当前是否暂停
     * @return	是否暂停
     */
    get paused(): boolean;
    /**
     * 设置是否暂停
     * @param	value 是否暂停
     */
    set paused(value: boolean);
    /**
     * 获取缓存帧率间隔时间
     * @return	缓存帧率间隔时间
     */
    get cacheFrameRateInterval(): number;
    /**
     * 获取当前播放状态
     * @return	当前播放状态
     */
    get state(): number;
    /**
     * 获取是否已销毁。
     * @return 是否已销毁。
     */
    get destroyed(): boolean;
    /**
     * 创建一个 <code>AnimationPlayer</code> 实例。
     */
    constructor();
    /**
     * @private
     */
    private _setPlayParams;
    /**
     * 动画停止了对应的参数。目前都是设置时间为最后
     * @private
     */
    private _setPlayParamsWhenStop;
    /**
     * 播放动画。
     * @param	index 动画索引。
     * @param	playbackRate 播放速率。
     * @param	duration 播放时长（0为1次,Number.MAX_VALUE为循环播放）。
     * @param	playStart 播放的起始时间位置。
     * @param	playEnd 播放的结束时间位置。（0为动画一次循环的最长结束时间位置）。
     */
    play(index?: number, playbackRate?: number, overallDuration?: number, playStart?: number, playEnd?: number): void;
    /**
     * 播放动画。
     * @param	index 动画索引。
     * @param	playbackRate 播放速率。
     * @param	duration 播放时长（0为1次,Number.MAX_VALUE为循环播放）。
     * @param	playStartFrame 播放的原始起始帧率位置。
     * @param	playEndFrame 播放的原始结束帧率位置。（0为动画一次循环的最长结束时间位置）。
     */
    playByFrame(index?: number, playbackRate?: number, overallDuration?: number, playStartFrame?: number, playEndFrame?: number, fpsIn3DBuilder?: number): void;
    /**
     * 停止播放当前动画
     * 如果不是立即停止就等待动画播放完成后再停止
     * @param	immediate 是否立即停止
     */
    stop(immediate?: boolean): void;
    /**
     * @private
     */
    destroy(): void;
}
