import { Vector3 } from "../../math/Vector3";
import { LightSprite } from "./LightSprite";
/**
 * <code>DirectionLight</code> 类用于创建平行光。
 */
export declare class DirectionLight extends LightSprite {
    /**@iternal */
    _direction: Vector3;
    /**
     * @inheritDoc
     * @override
     */
    set shadow(value: boolean);
    /**
     * 创建一个 <code>DirectionLight</code> 实例。
     */
    constructor();
}
