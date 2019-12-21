import { ColliderBase } from "./ColliderBase";
/**
     * 2D线形碰撞体
     */
export declare class ChainCollider extends ColliderBase {
    /**相对节点的x轴偏移*/
    private _x;
    /**相对节点的y轴偏移*/
    private _y;
    /**用逗号隔开的点的集合，格式：x,y,x,y ...*/
    private _points;
    /**是否是闭环，注意不要有自相交的链接形状，它可能不能正常工作*/
    private _loop;
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
    /**用逗号隔开的点的集合，格式：x,y,x,y ...*/
    get points(): string;
    set points(value: string);
    /**是否是闭环，注意不要有自相交的链接形状，它可能不能正常工作*/
    get loop(): boolean;
    set loop(value: boolean);
}
