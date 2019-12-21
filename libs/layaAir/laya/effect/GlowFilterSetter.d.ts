import { FilterSetterBase } from "././FilterSetterBase";
/**
 * ...
 * @author ww
 */
export declare class GlowFilterSetter extends FilterSetterBase {
    /**
     * 滤镜的颜色
     */
    private _color;
    /**
     * 边缘模糊的大小 0~20
     */
    private _blur;
    /**
     * X轴方向的偏移
     */
    private _offX;
    /**
     * Y轴方向的偏移
     */
    private _offY;
    constructor();
    /**
    * @override
     */
    protected buildFilter(): void;
    get color(): string;
    set color(value: string);
    get blur(): number;
    set blur(value: number);
    get offX(): number;
    set offX(value: number);
    get offY(): number;
    set offY(value: number);
}
