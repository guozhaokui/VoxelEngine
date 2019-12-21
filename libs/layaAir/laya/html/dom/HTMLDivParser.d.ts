import { HTMLElement } from "./HTMLElement";
import { Rectangle } from "../../maths/Rectangle";
import { Handler } from "../../utils/Handler";
/**
 * @private
 */
export declare class HTMLDivParser extends HTMLElement {
    /** 实际内容的高 */
    contextHeight: number;
    /** 实际内容的宽 */
    contextWidth: number;
    /** @private */
    private _htmlBounds;
    /** @private */
    private _boundsRec;
    /** 重绘回调 */
    repaintHandler: Handler;
    /**
     * @override
     */
    reset(): HTMLElement;
    /**
     * 设置标签内容
     */
    set innerHTML(text: string);
    /**
     * @override
     */
    set width(value: number);
    /**
     * 追加内容，解析并对显示对象排版
     * @param	text
     */
    appendHTML(text: string): void;
    /**
     * 获取bounds
     * @return
     */
    getBounds(): Rectangle;
    /**
     * @override
     */
    parentRepaint(recreate?: boolean): void;
    /**
     * @private
     * 对显示内容进行排版
     */
    layout(): void;
    /**
     * 获取对象的高
     * @override
     */
    get height(): number;
    set height(value: number);
    /**
     * 获取对象的宽
     * @override
     */
    get width(): number;
}
