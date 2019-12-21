import { IVertex } from "../../graphics/IVertex";
import { VertexDeclaration } from "../../graphics/VertexDeclaration";
/**
 * <code>VertexTrail</code> 类用于创建拖尾顶点结构。
 */
export declare class VertexTrail implements IVertex {
    static TRAIL_POSITION0: number;
    static TRAIL_OFFSETVECTOR: number;
    static TRAIL_TIME0: number;
    static TRAIL_TEXTURECOORDINATE0Y: number;
    static TRAIL_TEXTURECOORDINATE0X: number;
    static TRAIL_COLOR: number;
    static get vertexDeclaration1(): VertexDeclaration;
    static get vertexDeclaration2(): VertexDeclaration;
    get vertexDeclaration(): VertexDeclaration;
}
