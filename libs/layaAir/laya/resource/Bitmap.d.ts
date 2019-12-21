import { Resource } from "./Resource";
/**
     * @private
     * <code>Bitmap</code> 图片资源类。
     */
export declare class Bitmap extends Resource {
    /**@private */
    protected _width: number;
    /**@private */
    protected _height: number;
    /**
     * 获取宽度。
     */
    get width(): number;
    set width(width: number);
    /***
     * 获取高度。
     */
    get height(): number;
    set height(height: number);
    /**
     * 创建一个 <code>Bitmap</code> 实例。
     */
    constructor();
}
