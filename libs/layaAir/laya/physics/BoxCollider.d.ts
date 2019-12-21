import { ColliderBase } from "./ColliderBase";
/**
     * 2D矩形碰撞体
     */
export declare class BoxCollider extends ColliderBase {
    /**相对节点的x轴偏移*/
    private _x;
    /**相对节点的y轴偏移*/
    private _y;
    /**矩形宽度*/
    private _width;
    /**矩形高度*/
    private _height;
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
    /**矩形宽度*/
    get width(): number;
    set width(value: number);
    /**矩形高度*/
    get height(): number;
    set height(value: number);
    /**@private 重置形状
     * @override
    */
    resetShape(re?: boolean): void;
}
