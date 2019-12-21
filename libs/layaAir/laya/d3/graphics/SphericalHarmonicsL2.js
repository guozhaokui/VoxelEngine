/**
 * 二阶球谐函数。
 */
export class SphericalHarmonicsL2 {
    constructor() {
        /** @internal */
        this._coefficients = new Float32Array(27);
    }
    /**
     * 获取颜色通道的系数。
     * @param i 通道索引，范围0到2。
     * @param j 系数索引，范围0到8。
     */
    getCoefficient(i, j) {
        return this._coefficients[i * 3 + j];
    }
    /**
     * 设置颜色通道的系数。
     * @param i 通道索引，范围0到2。
     * @param j 系数索引，范围0到8。
     */
    setCoefficient(i, j, coefficient) {
        this._coefficients[i * 3 + j] = coefficient;
    }
}
/** @internal */
SphericalHarmonicsL2._default = new SphericalHarmonicsL2();
