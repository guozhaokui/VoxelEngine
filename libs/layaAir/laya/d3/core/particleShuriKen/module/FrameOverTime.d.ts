import { GradientDataInt } from "./GradientDataInt";
import { IClone } from "../../IClone";
/**
 * <code>FrameOverTime</code> 类用于创建时间帧。
 */
export declare class FrameOverTime implements IClone {
    /**
     * 通过固定帧创建一个 <code>FrameOverTime</code> 实例。
     * @param	constant 固定帧。
     * @return 时间帧。
     */
    static createByConstant(constant?: number): FrameOverTime;
    /**
     * 通过时间帧创建一个 <code>FrameOverTime</code> 实例。
     * @param	overTime 时间帧。
     * @return 时间帧。
     */
    static createByOverTime(overTime: GradientDataInt): FrameOverTime;
    /**
     * 通过随机双固定帧创建一个 <code>FrameOverTime</code> 实例。
     * @param	constantMin 最小固定帧。
     * @param	constantMax 最大固定帧。
     * @return 时间帧。
     */
    static createByRandomTwoConstant(constantMin?: number, constantMax?: number): FrameOverTime;
    /**
     * 通过随机双时间帧创建一个 <code>FrameOverTime</code> 实例。
     * @param	gradientFrameMin 最小时间帧。
     * @param	gradientFrameMax 最大时间帧。
     * @return 时间帧。
     */
    static createByRandomTwoOverTime(gradientFrameMin: GradientDataInt, gradientFrameMax: GradientDataInt): FrameOverTime;
    private _type;
    private _constant;
    private _overTime;
    private _constantMin;
    private _constantMax;
    private _overTimeMin;
    private _overTimeMax;
    /**
     *生命周期旋转类型,0常量模式，1曲线模式，2随机双常量模式，3随机双曲线模式。
     */
    get type(): number;
    /**
     * 固定帧。
     */
    get constant(): number;
    /**
     * 时间帧。
     */
    get frameOverTimeData(): GradientDataInt;
    /**
     * 最小固定帧。
     */
    get constantMin(): number;
    /**
     * 最大固定帧。
     */
    get constantMax(): number;
    /**
     * 最小时间帧。
     */
    get frameOverTimeDataMin(): GradientDataInt;
    /**
     * 最大时间帧。
     */
    get frameOverTimeDataMax(): GradientDataInt;
    /**
     * 创建一个 <code>FrameOverTime,不允许new，请使用静态创建函数。</code> 实例。
     */
    constructor();
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
