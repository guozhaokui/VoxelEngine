import { Component } from "../../components/Component";
/**
 * 关节基类
 */
export declare class JointBase extends Component {
    /**原生关节对象*/
    protected _joint: any;
    /**[只读]原生关节对象*/
    get joint(): any;
    protected _createJoint(): void;
}
