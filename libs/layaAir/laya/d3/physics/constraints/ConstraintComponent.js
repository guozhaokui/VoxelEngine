import { Component } from "../../../components/Component";
import { Physics3D } from "../Physics3D";
/**
 * <code>ConstraintComponent</code> 类用于创建约束的父类。
 */
export class ConstraintComponent extends Component {
    /**
     * 创建一个 <code>ConstraintComponent</code> 实例。
     */
    constructor() {
        super();
        /**@internal */
        this._feedbackEnabled = false;
    }
    /**
     * @inheritDoc
     * @override
     */
    get enabled() {
        return super.enabled;
    }
    /**
     * @inheritDoc
     * @override
     */
    set enabled(value) {
        this._btConstraint.IsEnabled = value;
        super.enabled = value;
    }
    /**
     * 获取打破冲力阈值。
     * @return 打破冲力阈值。
     */
    get breakingImpulseThreshold() {
        return this._breakingImpulseThreshold;
    }
    /**
     * 设置打破冲力阈值。
     * @param value 打破冲力阈值。
     */
    set breakingImpulseThreshold(value) {
        this._btConstraint.BreakingImpulseThreshold = value;
        this._breakingImpulseThreshold = value;
    }
    /**
     * 获取应用的冲力。
     */
    get appliedImpulse() {
        if (!this._feedbackEnabled) {
            this._btConstraint.EnableFeedback(true);
            this._feedbackEnabled = true;
        }
        return this._btConstraint.AppliedImpulse;
    }
    /**
     * 获取已连接的刚体。
     * @return 已连接刚体。
     */
    get connectedBody() {
        return this._connectedBody;
    }
    /**
     * 设置已连接刚体。
     * @param value 已连接刚体。
     */
    set connectedBody(value) {
        this._connectedBody = value;
    }
    /**
     * @inheritDoc
     * @internal
     * @override
     */
    _onDestroy() {
        var physics3D = Physics3D._bullet;
        physics3D.destroy(this._btConstraint);
        this._btConstraint = null;
    }
}
