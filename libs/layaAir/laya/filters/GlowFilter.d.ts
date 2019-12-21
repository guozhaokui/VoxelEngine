import { Filter } from "./Filter";
/**
 *  发光滤镜(也可以当成阴影滤使用）
 */
export declare class GlowFilter extends Filter {
    /**数据的存储，顺序R,G,B,A,blurWidth,offX,offY;*/
    private _elements;
    /**滤镜的颜色*/
    private _color;
    /**
     * 创建发光滤镜
     * @param	color	滤镜的颜色
     * @param	blur	边缘模糊的大小
     * @param	offX	X轴方向的偏移
     * @param	offY	Y轴方向的偏移
     */
    constructor(color: string, blur?: number, offX?: number, offY?: number);
    /**
     * @private
     * 滤镜类型
     * @override
     */
    get type(): number;
    /**@private */
    get offY(): number;
    /**@private */
    set offY(value: number);
    /**@private */
    get offX(): number;
    /**@private */
    set offX(value: number);
    /**@private */
    getColor(): any[];
    /**@private */
    get blur(): number;
    /**@private */
    set blur(value: number);
    getColorNative(): Float32Array;
    getBlurInfo1Native(): Float32Array;
    getBlurInfo2Native(): Float32Array;
}
