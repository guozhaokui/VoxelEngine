import { Context } from "../../resource/Context";
import { WordText } from "../../utils/WordText";
import { HTMLChar } from "../../utils/HTMLChar";
/**
 * 绘制文字
 */
export declare class FillTextCmd {
    static ID: string;
    private _text;
    _words: HTMLChar[];
    /**
     * 开始绘制文本的 x 坐标位置（相对于画布）。
     */
    x: number;
    /**
     * 开始绘制文本的 y 坐标位置（相对于画布）。
     */
    y: number;
    private _font;
    private _color;
    private _borderColor;
    private _lineWidth;
    private _textAlign;
    private _fontColor;
    private _strokeColor;
    private static _defFontObj;
    private _fontObj;
    private _nTexAlign;
    /**@private */
    static create(text: string | WordText, words: HTMLChar[], x: number, y: number, font: string, color: string, textAlign: string, lineWidth: number, borderColor: string): FillTextCmd;
    /**
     * 回收到对象池
     */
    recover(): void;
    /**@private */
    run(context: Context, gx: number, gy: number): void;
    /**@private */
    get cmdID(): string;
    /**
     * 在画布上输出的文本。
     */
    get text(): string | WordText;
    set text(value: string | WordText);
    /**
     * 定义字号和字体，比如"20px Arial"。
     */
    get font(): string;
    set font(value: string);
    /**
     * 定义文本颜色，比如"#ff0000"。
     */
    get color(): string;
    set color(value: string);
    /**
     * 文本对齐方式，可选值："left"，"center"，"right"。
     */
    get textAlign(): string;
    set textAlign(value: string);
}
