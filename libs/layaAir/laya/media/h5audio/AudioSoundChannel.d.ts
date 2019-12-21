import { SoundChannel } from "../SoundChannel";
/**
 * @private
 * audio标签播放声音的音轨控制
 */
export declare class AudioSoundChannel extends SoundChannel {
    /**
     * 播放用的audio标签
     */
    private _audio;
    private _onEnd;
    private _resumePlay;
    constructor(audio: HTMLAudioElement);
    private __onEnd;
    private __resumePlay;
    /**
     * 播放
     * @override
     */
    play(): void;
    /**
     * 当前播放到的位置
     * @return
     * @override
     *
     */
    get position(): number;
    /**
     * 获取总时间。
     * @override
     */
    get duration(): number;
    /**
     * 停止播放
     * @override
     */
    stop(): void;
    /**
     * @override
     */
    pause(): void;
    /**
     * @override
     */
    resume(): void;
    /**
     * 设置音量
     * @param v
     * @override
     *
     */
    set volume(v: number);
    /**
     * 获取音量
     * @return
     * @override
     *
     */
    get volume(): number;
}
