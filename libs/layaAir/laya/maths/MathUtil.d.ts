/**
     * @private
     * <code>MathUtil</code> 是一个数据处理工具类。
     */
export declare class MathUtil {
    static subtractVector3(l: Float32Array, r: Float32Array, o: Float32Array): void;
    static lerp(left: number, right: number, amount: number): number;
    static scaleVector3(f: Float32Array, b: number, e: Float32Array): void;
    static lerpVector3(l: Float32Array, r: Float32Array, t: number, o: Float32Array): void;
    static lerpVector4(l: Float32Array, r: Float32Array, t: number, o: Float32Array): void;
    static slerpQuaternionArray(a: Float32Array, Offset1: number, b: Float32Array, Offset2: number, t: number, out: Float32Array, Offset3: number): Float32Array;
    /**
     * 获取指定的两个点组成的线段的角度值。
     * @param	x0 点一的 X 轴坐标值。
     * @param	y0 点一的 Y 轴坐标值。
     * @param	x1 点二的 X 轴坐标值。
     * @param	y1 点二的 Y 轴坐标值。
     * @return 角度值。
     */
    static getRotation(x0: number, y0: number, x1: number, y1: number): number;
    /**
     * 一个用来确定数组元素排序顺序的比较函数。
     * @param	a 待比较数字。
     * @param	b 待比较数字。
     * @return 如果a等于b 则值为0；如果b>a则值为1；如果b<则值为-1。
     */
    static sortBigFirst(a: number, b: number): number;
    /**
     * 一个用来确定数组元素排序顺序的比较函数。
     * @param	a 待比较数字。
     * @param	b 待比较数字。
     * @return 如果a等于b 则值为0；如果b>a则值为-1；如果b<则值为1。
     */
    static sortSmallFirst(a: number, b: number): number;
    /**
     * 将指定的元素转为数字进行比较。
     * @param	a 待比较元素。
     * @param	b 待比较元素。
     * @return b、a转化成数字的差值 (b-a)。
     */
    static sortNumBigFirst(a: any, b: any): number;
    /**
     * 将指定的元素转为数字进行比较。
     * @param	a 待比较元素。
     * @param	b 待比较元素。
     * @return a、b转化成数字的差值 (a-b)。
     */
    static sortNumSmallFirst(a: any, b: any): number;
    /**
     * 返回根据对象指定的属性进行排序的比较函数。
     * @param	key 排序要依据的元素属性名。
     * @param	bigFirst 如果值为true，则按照由大到小的顺序进行排序，否则按照由小到大的顺序进行排序。
     * @param	forceNum 如果值为true，则将排序的元素转为数字进行比较。
     * @return 排序函数。
     */
    static sortByKey(key: string, bigFirst?: boolean, forceNum?: boolean): (a: any, b: any) => number;
}
