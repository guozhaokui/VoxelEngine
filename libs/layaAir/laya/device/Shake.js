import { Accelerator } from "./motion/Accelerator";
import { EventDispatcher } from "../events/EventDispatcher";
import { Event } from "../events/Event";
import { ILaya } from "../../ILaya";
/**
 * Shake只能在支持此操作的设备上有效。
 *
 */
export class Shake extends EventDispatcher {
    constructor() {
        super();
    }
    static get instance() {
        Shake._instance = Shake._instance || new Shake();
        return Shake._instance;
    }
    /**
     * 开始响应设备摇晃。
     * @param	throushold	响应的瞬时速度阈值，轻度摇晃的值约在5~10间。
     * @param	timeout		设备摇晃的响应间隔时间。
     * @param	callback	在设备摇晃触发时调用的处理器。
     */
    start(throushold, interval) {
        this.throushold = throushold;
        this.shakeInterval = interval;
        this.lastX = this.lastY = this.lastZ = NaN;
        // 使用加速器监听设备运动。
        Accelerator.instance.on(Event.CHANGE, this, this.onShake);
    }
    /**
     * 停止响应设备摇晃。
     */
    stop() {
        Accelerator.instance.off(Event.CHANGE, this, this.onShake);
    }
    onShake(acceleration, accelerationIncludingGravity, rotationRate, interval) {
        // 设定摇晃的初始状态。
        if (isNaN(this.lastX)) {
            this.lastX = accelerationIncludingGravity.x;
            this.lastY = accelerationIncludingGravity.y;
            this.lastZ = accelerationIncludingGravity.z;
            this.lastMillSecond = ILaya.Browser.now();
            return;
        }
        // 速度增量计算。
        var deltaX = Math.abs(this.lastX - accelerationIncludingGravity.x);
        var deltaY = Math.abs(this.lastY - accelerationIncludingGravity.y);
        var deltaZ = Math.abs(this.lastZ - accelerationIncludingGravity.z);
        // 是否满足摇晃选项。
        if (this.isShaked(deltaX, deltaY, deltaZ)) {
            var deltaMillSecond = ILaya.Browser.now() - this.lastMillSecond;
            // 按照设定间隔触发摇晃。
            if (deltaMillSecond > this.shakeInterval) {
                this.event(Event.CHANGE);
                this.lastMillSecond = ILaya.Browser.now();
            }
        }
        this.lastX = accelerationIncludingGravity.x;
        this.lastY = accelerationIncludingGravity.y;
        this.lastZ = accelerationIncludingGravity.z;
    }
    // 通过任意两个分量判断是否满足摇晃设定。
    isShaked(deltaX, deltaY, deltaZ) {
        return (deltaX > this.throushold && deltaY > this.throushold) ||
            (deltaX > this.throushold && deltaZ > this.throushold) ||
            (deltaY > this.throushold && deltaZ > this.throushold);
    }
}
