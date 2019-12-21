import { Vector2 } from "../math/Vector2";
import { Mesh } from "../resource/models/Mesh";
import { Texture2D } from "../../resource/Texture2D";
/**
 * <code>HeightMap</code> 类用于实现高度图数据。
 */
export declare class HeightMap {
    private static _tempRay;
    /**
     * 从网格精灵生成高度图。
     * @param meshSprite 网格精灵。
     * @param width	高度图宽度。
     * @param height 高度图高度。
     * @param outCellSize 输出 单元尺寸。
     */
    static creatFromMesh(mesh: Mesh, width: number, height: number, outCellSize: Vector2): HeightMap;
    /**
     * 从图片生成高度图。
     * @param image 图片。
     * @param maxHeight 最小高度。
     * @param maxHeight 最大高度。
     */
    static createFromImage(texture: Texture2D, minHeight: number, maxHeight: number): HeightMap;
    private static _getPosition;
    private _datas;
    private _w;
    private _h;
    private _minHeight;
    private _maxHeight;
    /**
     * 获取宽度。
     * @return value 宽度。
     */
    get width(): number;
    /**
     * 获取高度。
     * @return value 高度。
     */
    get height(): number;
    /**
     * 最大高度。
     * @return value 最大高度。
     */
    get maxHeight(): number;
    /**
     * 最大高度。
     * @return value 最大高度。
     */
    get minHeight(): number;
    /**
     * 创建一个 <code>HeightMap</code> 实例。
     * @param width 宽度。
     * @param height 高度。
     * @param minHeight 最大高度。
     * @param maxHeight 最大高度。
     */
    constructor(width: number, height: number, minHeight: number, maxHeight: number);
    /**
     * 获取高度。
     * @param row 列数。
     * @param col 行数。
     * @return 高度。
     */
    getHeight(row: number, col: number): number;
}
