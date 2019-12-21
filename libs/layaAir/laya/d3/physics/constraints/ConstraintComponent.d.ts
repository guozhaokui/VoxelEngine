import { Component } from "../../../components/Component";
import { Rigidbody3D } from "../Rigidbody3D";
/**
 * <code>ConstraintComponent</code> 类用于创建约束的父类。
 */
export declare class ConstraintComponent extends Component {
    /**
     * @inheritDoc
     * @override
     */
    get enabled(): boolean;
    /**
     * @inheritDoc
     * @override
     */
    set enabled(value: boolean);
    /**
     * 获取打破冲力阈值。
     * @return 打破冲力阈值。
     */
    get breakingImpulseThreshold(): number;
    /**
     * 设置打破冲力阈值。
     * @param value 打破冲力阈值。
     */
    set breakingImpulseThreshold(value: number);
    /**
     * 获取应用的冲力。
     */
    get appliedImpulse(): number;
    /**
     * 获取已连接的刚体。
     * @return 已连接刚体。
     */
    get connectedBody(): Rigidbody3D;
    /**
     * 设置已连接刚体。
     * @param value 已连接刚体。
     */
    set connectedBody(value: Rigidbody3D);
    /**
     * 创建一个 <code>ConstraintComponent</code> 实例。
     */
    constructor();
}
