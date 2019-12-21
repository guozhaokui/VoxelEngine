import { Color } from "../math/Color";
/**
 * <code>TextMesh</code> 类用于创建文本网格。
 */
export declare class TextMesh {
    private static _indexBuffer;
    private _vertices;
    private _vertexBuffer;
    private _text;
    private _fontSize;
    private _color;
    /**
     * 获取文本。
     * @return 文本。
     */
    get text(): string;
    /**
     * 设置文本。
     * @param value 文本。
     */
    set text(value: string);
    /**
     * 获取字体尺寸。
     * @param  value 字体尺寸。
     */
    get fontSize(): number;
    /**
     * 设置字体储存。
     * @return 字体尺寸。
     */
    set fontSize(value: number);
    /**
     * 获取颜色。
     * @return 颜色。
     */
    get color(): Color;
    /**
     * 设置颜色。
     * @param 颜色。
     */
    set color(value: Color);
    /**
     * 创建一个新的 <code>TextMesh</code> 实例。
     */
    constructor();
    private _createVertexBuffer;
    private _resizeVertexBuffer;
    private _addChar;
}
