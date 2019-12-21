import { Vector3 } from "./Vector3";
import { Matrix4x4 } from "./Matrix4x4";
import { Plane } from "./Plane";
import { BoundBox } from "./BoundBox";
import { BoundSphere } from "./BoundSphere";
/**
     * <code>BoundFrustum</code> 类用于创建锥截体。
     */
export declare class BoundFrustum {
    /**4x4矩阵*/
    private _matrix;
    /**近平面*/
    private _near;
    /**远平面*/
    private _far;
    /**左平面*/
    private _left;
    /**右平面*/
    private _right;
    /**顶平面*/
    private _top;
    /**底平面*/
    private _bottom;
    /**
     * 创建一个 <code>BoundFrustum</code> 实例。
     * @param	matrix 锥截体的描述4x4矩阵。
     */
    constructor(matrix: Matrix4x4);
    /**
     * 获取描述矩阵。
     * @return  描述矩阵。
     */
    get matrix(): Matrix4x4;
    /**
     * 设置描述矩阵。
     * @param matrix 描述矩阵。
     */
    set matrix(matrix: Matrix4x4);
    /**
     * 获取近平面。
     * @return  近平面。
     */
    get near(): Plane;
    /**
     * 获取远平面。
     * @return  远平面。
     */
    get far(): Plane;
    /**
     * 获取左平面。
     * @return  左平面。
     */
    get left(): Plane;
    /**
     * 获取右平面。
     * @return  右平面。
     */
    get right(): Plane;
    /**
     * 获取顶平面。
     * @return  顶平面。
     */
    get top(): Plane;
    /**
     * 获取底平面。
     * @return  底平面。
     */
    get bottom(): Plane;
    /**
     * 判断是否与其他锥截体相等。
     * @param	other 锥截体。
     */
    equalsBoundFrustum(other: BoundFrustum): boolean;
    /**
     * 判断是否与其他对象相等。
     * @param	obj 对象。
     */
    equalsObj(obj: any): boolean;
    /**
     * 获取锥截体的任意一平面。
     * 0:近平面
     * 1:远平面
     * 2:左平面
     * 3:右平面
     * 4:顶平面
     * 5:底平面
     * @param	index 索引。
     */
    getPlane(index: number): Plane;
    /**
     * 根据描述矩阵获取锥截体的6个面。
     * @param  m 描述矩阵。
     * @param  np   近平面。
     * @param  fp    远平面。
     * @param  lp   左平面。
     * @param  rp  右平面。
     * @param  tp    顶平面。
     * @param  bp 底平面。
     */
    private static _getPlanesFromMatrix;
    /**
     * 锥截体三个相交平面的交点。
     * @param  p1  平面1。
     * @param  p2  平面2。
     * @param  p3  平面3。
     */
    private static _get3PlaneInterPoint;
    /**
     * 锥截体的8个顶点。
     * @param  corners  返回顶点的输出队列。
     */
    getCorners(corners: Vector3[]): void;
    /**
     * 与点的位置关系。返回-1,包涵;0,相交;1,不相交
     * @param  point  点。
     */
    containsPoint(point: Vector3): number;
    /**
     * 是否与包围盒交叉。
     * @param box 包围盒。
     */
    intersects(box: BoundBox): boolean;
    /**
     * 与包围盒的位置关系。返回-1,包涵;0,相交;1,不相交
     * @param  box  包围盒。
     */
    containsBoundBox(box: BoundBox): number;
    /**
     * 与包围球的位置关系。返回-1,包涵;0,相交;1,不相交
     * @param  sphere  包围球。
     */
    containsBoundSphere(sphere: BoundSphere): number;
}
