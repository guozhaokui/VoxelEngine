import { VertexShuriKenParticle } from "./VertexShuriKenParticle";
import { VertexDeclaration } from "../VertexDeclaration";
import { Vector3 } from "../../math/Vector3";
import { Vector4 } from "../../math/Vector4";
/**
    /**
     * <code>VertexShurikenParticle</code> 类用于创建粒子顶点结构。
     */
export declare class VertexShurikenParticleMesh extends VertexShuriKenParticle {
    static get vertexDeclaration(): VertexDeclaration;
    get cornerTextureCoordinate(): Vector4;
    get position(): Vector4;
    get velocity(): Vector3;
    get startColor(): Vector4;
    get startSize(): Vector3;
    get startRotation0(): Vector3;
    get startRotation1(): Vector3;
    get startRotation2(): Vector3;
    get startLifeTime(): number;
    get time(): number;
    get startSpeed(): number;
    get random0(): Vector4;
    get random1(): Vector4;
    get simulationWorldPostion(): Vector3;
    constructor(cornerTextureCoordinate: Vector4, positionStartLifeTime: Vector4, velocity: Vector3, startColor: Vector4, startSize: Vector3, startRotation0: Vector3, startRotation1: Vector3, startRotation2: Vector3, ageAddScale: number, time: number, startSpeed: number, randoms0: Vector4, randoms1: Vector4, simulationWorldPostion: Vector3);
}
