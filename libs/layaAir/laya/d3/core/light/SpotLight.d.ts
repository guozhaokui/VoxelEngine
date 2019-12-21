import { LightSprite } from "./LightSprite";
/**
 * <code>SpotLight</code> 类用于创建聚光。
 */
export declare class SpotLight extends LightSprite {
    /**
    * 聚光灯的锥形角度。
    */
    get spotAngle(): number;
    set spotAngle(value: number);
    /**
     * 聚光的范围。
     */
    get range(): number;
    set range(value: number);
    /**
     * 创建一个 <code>SpotLight</code> 实例。
     */
    constructor();
}
