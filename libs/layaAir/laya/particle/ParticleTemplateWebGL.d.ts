import { ParticleTemplateBase } from "./ParticleTemplateBase";
import { ParticleSetting } from "./ParticleSetting";
import { MeshParticle2D } from "../webgl/utils/MeshParticle2D";
import { Context } from "../resource/Context";
/**
 *  @private
 */
export declare class ParticleTemplateWebGL extends ParticleTemplateBase {
    protected _vertices: Float32Array;
    protected _mesh: MeshParticle2D;
    protected _conchMesh: any;
    protected _floatCountPerVertex: number;
    protected _firstActiveElement: number;
    protected _firstNewElement: number;
    protected _firstFreeElement: number;
    protected _firstRetiredElement: number;
    protected _drawCounter: number;
    constructor(parSetting: ParticleSetting);
    reUse(context: Context, pos: number): number;
    protected initialize(): void;
    update(elapsedTime: number): void;
    private retireActiveParticles;
    private freeRetiredParticles;
    addNewParticlesToVertexBuffer(): void;
    /**
     *
     * @param position
     * @param velocity
     * @override
     */
    addParticleArray(position: Float32Array, velocity: Float32Array): void;
}
