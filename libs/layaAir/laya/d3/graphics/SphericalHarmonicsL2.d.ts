/**
 * 二阶球谐函数。
 */
export declare class SphericalHarmonicsL2 {
    /**
     * 获取颜色通道的系数。
     * @param i 通道索引，范围0到2。
     * @param j 系数索引，范围0到8。
     */
    getCoefficient(i: number, j: number): number;
    /**
     * 设置颜色通道的系数。
     * @param i 通道索引，范围0到2。
     * @param j 系数索引，范围0到8。
     */
    setCoefficient(i: number, j: number, coefficient: number): void;
}
