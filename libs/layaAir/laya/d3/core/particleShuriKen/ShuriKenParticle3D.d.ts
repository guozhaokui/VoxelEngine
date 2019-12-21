import { RenderableSprite3D } from "../RenderableSprite3D";
import { ShurikenParticleRenderer } from "./ShurikenParticleRenderer";
import { ShurikenParticleSystem } from "./ShurikenParticleSystem";
/**
 * <code>ShuriKenParticle3D</code> 3D粒子。
 */
export declare class ShuriKenParticle3D extends RenderableSprite3D {
    /**
     * 粒子系统。
     */
    get particleSystem(): ShurikenParticleSystem;
    /**
     * 粒子渲染器。
     */
    get particleRenderer(): ShurikenParticleRenderer;
    /**
     * 创建一个 <code>Particle3D</code> 实例。
     */
    constructor();
    /**
     * <p>销毁此对象。</p>
     * @param	destroyChild 是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
     * @override
     */
    destroy(destroyChild?: boolean): void;
}
