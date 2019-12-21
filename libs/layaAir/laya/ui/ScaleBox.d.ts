import { Box } from "./Box";
/**
 * 自适应缩放容器，容器设置大小后，容器大小始终保持stage大小，子内容按照原始最小宽高比缩放
 */
export declare class ScaleBox extends Box {
    private _oldW;
    private _oldH;
    /**
     * @override
     */
    onEnable(): void;
    /**
     * @override
     */
    onDisable(): void;
    private onResize;
    /**
     * @override
     */
    set width(value: number);
    get width(): number;
    /**
     * @override
     */
    set height(value: number);
    get height(): number;
}
