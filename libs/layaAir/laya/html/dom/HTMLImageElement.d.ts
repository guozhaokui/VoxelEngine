import { HTMLElement } from "./HTMLElement";
import { Graphics } from "../../display/Graphics";
/**
 * @private
 */
export declare class HTMLImageElement extends HTMLElement {
    private _tex;
    private _url;
    constructor();
    /**
     * @override
     */
    reset(): HTMLElement;
    set src(url: string);
    private onloaded;
    /**
     *
     * @param graphic
     * @param gX
     * @param gY
     * @param recList
     * @override
     */
    renderSelfToGraphic(graphic: Graphics, gX: number, gY: number, recList: any[]): void;
}
