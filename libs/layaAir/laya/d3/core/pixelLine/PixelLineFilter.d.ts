import { GeometryElement } from "../GeometryElement";
import { PixelLineData } from "./PixelLineData";
import { PixelLineSprite3D } from "./PixelLineSprite3D";
/**
 * <code>PixelLineFilter</code> 类用于线过滤器。
 */
export declare class PixelLineFilter extends GeometryElement {
    /** @private */
    private static _tempVector0;
    /** @private */
    private static _tempVector1;
    constructor(owner: PixelLineSprite3D, maxLineCount: number);
    /**
     *	{@inheritDoc PixelLineFilter._getType}
     *	@override
     */
    _getType(): number;
    /**
     * 获取线段数据
     * @return 线段数据。
     */
    _getLineData(index: number, out: PixelLineData): void;
    /**
     * @inheritDoc
     * @override
     */
    destroy(): void;
}
