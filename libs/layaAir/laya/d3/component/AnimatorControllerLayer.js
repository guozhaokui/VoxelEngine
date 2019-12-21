import { AnimatorPlayState } from "./AnimatorPlayState";
/**
 * <code>AnimatorControllerLayer</code> 类用于创建动画控制器层。
 */
export class AnimatorControllerLayer {
    /**
     * 创建一个 <code>AnimatorControllerLayer</code> 实例。
     */
    constructor(name) {
        /**@internal */
        this._defaultState = null;
        /**@internal */
        this._referenceCount = 0;
        /**@internal 0:常规播放、1:动态融合播放、2:固定融合播放*/
        this._playType = -1;
        /**@internal */
        this._crossDuration = -1;
        /**@internal */
        this._crossMark = 0;
        /**@internal */
        this._crossNodesOwnersCount = 0;
        /**@internal */
        this._crossNodesOwners = [];
        /**@internal */
        this._crossNodesOwnersIndicesMap = {};
        /**@internal */
        this._srcCrossClipNodeIndices = [];
        /**@internal */
        this._destCrossClipNodeIndices = [];
        /**@internal */
        this._statesMap = {};
        /**@internal */
        this._states = [];
        /**@internal */
        this._playStateInfo = new AnimatorPlayState();
        /**@internal */
        this._crossPlayStateInfo = new AnimatorPlayState();
        /** 名称。*/
        this.blendingMode = AnimatorControllerLayer.BLENDINGMODE_OVERRIDE;
        /** 权重。*/
        this.defaultWeight = 1.0;
        /**	激活时是否自动播放。*/
        this.playOnWake = true;
        this.name = name;
    }
    /**
     * 默认动画状态机。
     */
    get defaultState() {
        return this._defaultState;
    }
    set defaultState(value) {
        this._defaultState = value;
        this._statesMap[value.name] = value;
    }
    /**
     * @internal
     */
    _removeClip(clipStateInfos, statesMap, index, state) {
        var clip = state._clip;
        var clipStateInfo = clipStateInfos[index];
        clipStateInfos.splice(index, 1);
        delete statesMap[state.name];
        if (this._animator) {
            var frameNodes = clip._nodes;
            var nodeOwners = clipStateInfo._nodeOwners;
            clip._removeReference();
            for (var i = 0, n = frameNodes.count; i < n; i++)
                this._animator._removeKeyframeNodeOwner(nodeOwners, frameNodes.getNodeByIndex(i));
        }
    }
    /**
     * @implements IReferenceCounter
     */
    _getReferenceCount() {
        return this._referenceCount;
    }
    /**
     * @implements IReferenceCounter
     */
    _addReference(count = 1) {
        for (var i = 0, n = this._states.length; i < n; i++)
            this._states[i]._addReference(count);
        this._referenceCount += count;
    }
    /**
     * @implements IReferenceCounter
     */
    _removeReference(count = 1) {
        for (var i = 0, n = this._states.length; i < n; i++)
            this._states[i]._removeReference(count);
        this._referenceCount -= count;
    }
    /**
     * @implements IReferenceCounter
     */
    _clearReference() {
        this._removeReference(-this._referenceCount);
    }
    /**
     * 获取当前的播放状态。
     * @return 动画播放状态。
     */
    getCurrentPlayState() {
        return this._playStateInfo;
    }
    /**
     * 获取动画状态。
     * @return 动画状态。
     */
    getAnimatorState(name) {
        var state = this._statesMap[name];
        return state ? state : null;
    }
    /**
     * 添加动画状态。
     * @param	state 动画状态。
     * @param   layerIndex 层索引。
     */
    addState(state) {
        var stateName = state.name;
        if (this._statesMap[stateName]) {
            throw "AnimatorControllerLayer:this stat's name has exist.";
        }
        else {
            this._statesMap[stateName] = state;
            this._states.push(state);
            if (this._animator) {
                state._clip._addReference();
                this._animator._getOwnersByClip(state);
            }
        }
    }
    /**
     * 移除动画状态。
     * @param	state 动画状态。
     * @param   layerIndex 层索引。
     */
    removeState(state) {
        var states = this._states;
        var index = -1;
        for (var i = 0, n = states.length; i < n; i++) {
            if (states[i] === state) {
                index = i;
                break;
            }
        }
        if (index !== -1)
            this._removeClip(states, this._statesMap, index, state);
    }
    /**
     * 销毁。
     */
    destroy() {
        this._clearReference();
        this._statesMap = null;
        this._states = null;
        this._playStateInfo = null;
        this._crossPlayStateInfo = null;
        this._defaultState = null;
    }
    /**
     * 克隆。
     * @param	destObject 克隆源。
     */
    cloneTo(destObject) {
        var dest = destObject;
        dest.name = this.name;
        dest.blendingMode = this.blendingMode;
        dest.defaultWeight = this.defaultWeight;
        dest.playOnWake = this.playOnWake;
    }
    /**
     * 克隆。
     * @return	 克隆副本。
     */
    clone() {
        var dest = new AnimatorControllerLayer(this.name);
        this.cloneTo(dest);
        return dest;
    }
}
/**混合模式_覆盖。 */
AnimatorControllerLayer.BLENDINGMODE_OVERRIDE = 0;
/**混合模式_叠加。 */
AnimatorControllerLayer.BLENDINGMODE_ADDTIVE = 1;
