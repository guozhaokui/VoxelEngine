import { ColliderBase } from "./ColliderBase";
/**
     * 2D圆形碰撞体
     */
export declare class CircleCollider extends ColliderBase {
    /**@private */
    private static _temp;
    /**相对节点的x轴偏移*/
    private _x;
    /**相对节点的y轴偏移*/
    private _y;
    /**圆形半径，必须为正数*/
    private _radius;
    /**
     * @override
     */
    protected getDef(): any;
    private _setShape;
    /**相对节点的x轴偏移*/
    get x(): number;
    set x(value: number);
    /**相对节点的y轴偏移*/
    get y(): number;
    set y(value: number);
    /**圆形半径，必须为正数*/
    get radius(): number;
    set radius(value: number);
    /**@private 重置形状
     * @override
    */
    resetShape(re?: boolean): void;
}
