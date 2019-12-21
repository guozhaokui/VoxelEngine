import { LightSprite } from "./LightSprite";
/**
 * <code>PointLight</code> 类用于创建点光。
 */
export declare class PointLight extends LightSprite {
    /**
     * 点光的范围。
     * @return 点光的范围。
     */
    get range(): number;
    set range(value: number);
    /**
     * 创建一个 <code>PointLight</code> 实例。
     */
    constructor();
}
