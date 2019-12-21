import { AnimationBase } from "./AnimationBase";
/**
 * 动画播放完毕后调度。
 * @eventType Event.COMPLETE
 */
/**
 * 播放到某标签后调度。
 * @eventType Event.LABEL
 */
/**
 * 节点关键帧动画播放类。解析播放IDE内制作的节点动画。
 */
export declare class FrameAnimation extends AnimationBase {
    /**@private */
    private static _sortIndexFun;
    /**@private */
    protected _usedFrames: any[];
    constructor();
    /**@inheritDoc
     * @override
    */
    clear(): AnimationBase;
    /**@inheritDoc
     * @override
    */
    protected _displayToIndex(value: number): void;
    /**
     * @private
     * 将节点设置到某一帧的状态
     * @param node 节点ID
     * @param frame
     * @param targetDic 节点表
     */
    protected _displayNodeToFrame(node: any, frame: number, targetDic?: any): void;
    /**
     * @private
     * 计算帧数据
     */
    private _calculateDatas;
    /**
     * @private
     * 计算某个节点的帧数据
     */
    protected _calculateKeyFrames(node: any): void;
    /**
     * 重置节点，使节点恢复到动画之前的状态，方便其他动画控制
     */
    resetNodes(): void;
    /**
     * @private
     * 计算节点某个属性的帧数据
     */
    private _calculateNodePropFrames;
    /**
     * @private
     */
    private _dealKeyFrame;
    /**
     * @private
     * 计算两个关键帧直接的帧数据
     */
    private _calculateFrameValues;
}
