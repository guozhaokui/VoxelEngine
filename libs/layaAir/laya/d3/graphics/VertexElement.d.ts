/**
* <code>VertexElement</code> 类用于创建顶点结构分配。
*/
export declare class VertexElement {
    get offset(): number;
    get elementFormat(): string;
    get elementUsage(): number;
    constructor(offset: number, elementFormat: string, elementUsage: number);
}
