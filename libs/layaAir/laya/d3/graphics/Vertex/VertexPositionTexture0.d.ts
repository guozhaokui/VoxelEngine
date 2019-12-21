import { IVertex } from "../IVertex";
import { VertexDeclaration } from "../VertexDeclaration";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
/**
 * <code>VertexPositionNormalTexture</code> 类用于创建位置、纹理顶点结构。
 */
export declare class VertexPositionTexture0 implements IVertex {
    private static _vertexDeclaration;
    static get vertexDeclaration(): VertexDeclaration;
    private _position;
    private _textureCoordinate0;
    get position(): Vector3;
    get textureCoordinate0(): Vector2;
    get vertexDeclaration(): VertexDeclaration;
    constructor(position: Vector3, textureCoordinate0: Vector2);
}
