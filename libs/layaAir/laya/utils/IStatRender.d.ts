/**
     * @author laya
     */
export declare class IStatRender {
    /**
     * 显示性能统计信息。
     * @param	x X轴显示位置。
     * @param	y Y轴显示位置。
     */
    show(x?: number, y?: number): void;
    /**激活性能统计*/
    enable(): void;
    /**
     * 隐藏性能统计信息。
     */
    hide(): void;
    /**
     * 点击性能统计显示区域的处理函数。
     */
    set_onclick(fn: Function): void;
    isCanvasRender(): boolean;
    renderNotCanvas(ctx: any, x: number, y: number): void;
}
