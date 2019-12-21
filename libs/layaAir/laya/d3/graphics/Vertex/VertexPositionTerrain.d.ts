import { IVertex } from "../IVertex";
import { VertexDeclaration } from "../VertexDeclaration";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
/**
 * <code>VertexPositionTerrain</code> 类用于创建位置、法线、纹理1、纹理2顶点结构。
 */
export declare class VertexPositionTerrain implements IVertex {
    static TERRAIN_POSITION0: number;
    static TERRAIN_NORMAL0: number;
    static TERRAIN_TEXTURECOORDINATE0: number;
    static TERRAIN_TEXTURECOORDINATE1: number;
    private static _vertexDeclaration;
    static get vertexDeclaration(): VertexDeclaration;
    private _position;
    private _normal;
    private _textureCoord0;
    private _textureCoord1;
    get position(): Vector3;
    get normal(): Vector3;
    get textureCoord0(): Vector2;
    get textureCoord1(): Vector2;
    get vertexDeclaration(): VertexDeclaration;
    constructor(position: Vector3, normal: Vector3, textureCoord0: Vector2, textureCoord1: Vector2);
}
