import { Context } from "../../resource/Context";
import { SubmitBase } from "./SubmitBase";
/**
 * cache as normal 模式下的生成的canvas的渲染。
 */
export declare class SubmitCanvas extends SubmitBase {
    canv: Context;
    static create(canvas: any, alpha: number, filters: any[]): SubmitCanvas;
    constructor();
    /**
     * @override
     */
    renderSubmit(): number;
    /**
     * @override
     */
    releaseRender(): void;
    /**
     * @override
     */
    getRenderType(): number;
    static POOL: any;
}
