import { Box } from "./Box";
import { Node } from "../display/Node";
/**
 * <code>LayoutBox</code> 是一个布局容器类。
 */
export declare class LayoutBox extends Box {
    /**@private */
    protected _space: number;
    /**@private */
    protected _align: string;
    /**@private */
    protected _itemChanged: boolean;
    /**
     * @inheritDoc
     * @override
    */
    addChild(child: Node): Node;
    private onResize;
    /**
     * @inheritDoc
     * @override
    */
    addChildAt(child: Node, index: number): Node;
    /**
     *  @inheritDoc
     * @override
    */
    removeChildAt(index: number): Node;
    /** 刷新。*/
    refresh(): void;
    /**
     * 改变子对象的布局。
     */
    protected changeItems(): void;
    /** 子对象的间隔。*/
    get space(): number;
    set space(value: number);
    /** 子对象对齐方式。*/
    get align(): string;
    set align(value: string);
    /**
     * 排序项目列表。可通过重写改变默认排序规则。
     * @param items  项目列表。
     */
    protected sortItem(items: any[]): void;
    protected _setItemChanged(): void;
}
