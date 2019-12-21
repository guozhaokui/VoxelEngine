import { FilterSetterBase } from "./FilterSetterBase";
/**
 * ...
 * @author ww
 */
export declare class ColorFilterSetter extends FilterSetterBase {
    /**
     * brightness 亮度,范围:-100~100
     */
    private _brightness;
    /**
     * contrast 对比度,范围:-100~100
     */
    private _contrast;
    /**
     * saturation 饱和度,范围:-100~100
     */
    private _saturation;
    /**
     * hue 色调,范围:-180~180
     */
    private _hue;
    /**
     * red red增量,范围:0~255
     */
    private _red;
    /**
     * green green增量,范围:0~255
     */
    private _green;
    /**
     * blue blue增量,范围:0~255
     */
    private _blue;
    /**
     * alpha alpha增量,范围:0~255
     */
    private _alpha;
    constructor();
    /**
     * @override
     */
    protected buildFilter(): void;
    get brightness(): number;
    set brightness(value: number);
    get contrast(): number;
    set contrast(value: number);
    get saturation(): number;
    set saturation(value: number);
    get hue(): number;
    set hue(value: number);
    get red(): number;
    set red(value: number);
    get green(): number;
    set green(value: number);
    get blue(): number;
    set blue(value: number);
    private _color;
    get color(): string;
    set color(value: string);
    get alpha(): number;
    set alpha(value: number);
}
