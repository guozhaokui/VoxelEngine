import { Mesh } from "../../resource/models/Mesh";
import { Bounds } from "../Bounds";
import { BaseRender } from "../render/BaseRender";
import { ShuriKenParticle3D } from "./ShuriKenParticle3D";
/**
 * <code>ShurikenParticleRender</code> 类用于创建3D粒子渲染器。
 */
export declare class ShurikenParticleRenderer extends BaseRender {
    /**拉伸广告牌模式摄像机速度缩放,暂不支持。*/
    stretchedBillboardCameraSpeedScale: number;
    /**拉伸广告牌模式速度缩放。*/
    stretchedBillboardSpeedScale: number;
    /**拉伸广告牌模式长度缩放。*/
    stretchedBillboardLengthScale: number;
    /**
     * 获取渲染模式,0为BILLBOARD、1为STRETCHEDBILLBOARD、2为HORIZONTALBILLBOARD、3为VERTICALBILLBOARD、4为MESH。
     */
    get renderMode(): number;
    set renderMode(value: number);
    /**
     * 获取网格渲染模式所使用的Mesh,rendderMode为4时生效。
     */
    get mesh(): Mesh;
    set mesh(value: Mesh);
    /**
     * 创建一个 <code>ShurikenParticleRender</code> 实例。
     */
    constructor(owner: ShuriKenParticle3D);
    /**
     * @inheritDoc
     * @override
     */
    get bounds(): Bounds;
}
