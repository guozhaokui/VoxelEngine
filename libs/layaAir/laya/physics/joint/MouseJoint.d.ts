import { JointBase } from "./JointBase";
import { RigidBody } from "../RigidBody";
/**
 * 鼠标关节：鼠标关节用于通过鼠标来操控物体。它试图将物体拖向当前鼠标光标的位置。而在旋转方面就没有限制。
 */
export declare class MouseJoint extends JointBase {
    /**@private */
    private static _temp;
    /**[首次设置有效]关节的自身刚体*/
    selfBody: RigidBody;
    /**[首次设置有效]关节的链接点，是相对于自身刚体的左上角位置偏移，如果不设置，则根据鼠标点击点作为连接点*/
    anchor: any[];
    /**鼠标关节在拖曳刚体bodyB时施加的最大作用力*/
    private _maxForce;
    /**弹簧系统的震动频率，可以视为弹簧的弹性系数*/
    private _frequency;
    /**刚体在回归到节点过程中受到的阻尼，取值0~1*/
    private _damping;
    private onMouseDown;
    /**
     * @override
     *
     */
    protected _createJoint(): void;
    private onStageMouseUp;
    private onMouseMove;
    /**鼠标关节在拖曳刚体bodyB时施加的最大作用力*/
    get maxForce(): number;
    set maxForce(value: number);
    /**弹簧系统的震动频率，可以视为弹簧的弹性系数*/
    get frequency(): number;
    set frequency(value: number);
    /**刚体在回归到节点过程中受到的阻尼，取值0~1*/
    get damping(): number;
    set damping(value: number);
}
