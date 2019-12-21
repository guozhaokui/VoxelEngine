/**
 * <code>GradientDataInt</code> 类用于创建整形渐变。
 */
export class GradientDataInt {
    /**
     * 创建一个 <code>GradientDataInt</code> 实例。
     */
    constructor() {
        this._currentLength = 0;
        this._elements = new Float32Array(8);
    }
    /**整形渐变数量。*/
    get gradientCount() {
        return this._currentLength / 2;
    }
    /**
     * 增加整形渐变。
     * @param	key 生命周期，范围为0到1。
     * @param	value 整形值。
     */
    add(key, value) {
        if (this._currentLength < 8) {
            if ((this._currentLength === 6) && ((key !== 1))) {
                key = 1;
                console.log("Warning:the forth key is  be force set to 1.");
            }
            this._elements[this._currentLength++] = key;
            this._elements[this._currentLength++] = value;
        }
        else {
            console.log("Warning:data count must lessEqual than 4");
        }
    }
    /**
     * 克隆。
     * @param	destObject 克隆源。
     */
    cloneTo(destObject) {
        var destGradientDataInt = destObject;
        destGradientDataInt._currentLength = this._currentLength;
        var destElements = destGradientDataInt._elements;
        for (var i = 0, n = this._elements.length; i < n; i++) {
            destElements[i] = this._elements[i];
        }
    }
    /**
     * 克隆。
     * @return	 克隆副本。
     */
    clone() {
        var destGradientDataInt = new GradientDataInt();
        this.cloneTo(destGradientDataInt);
        return destGradientDataInt;
    }
}
