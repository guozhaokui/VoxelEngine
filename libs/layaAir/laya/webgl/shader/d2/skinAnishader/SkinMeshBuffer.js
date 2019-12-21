import { IndexBuffer2D } from "../../../utils/IndexBuffer2D";
import { VertexBuffer2D } from "../../../utils/VertexBuffer2D";
import { LayaGL } from "../../../../layagl/LayaGL";
export class SkinMeshBuffer {
    //TODO:coverage
    constructor() {
        var gl = LayaGL.instance;
        this.ib = IndexBuffer2D.create(gl.DYNAMIC_DRAW);
        this.vb = VertexBuffer2D.create(8);
    }
    //TODO:coverage
    static getInstance() {
        return SkinMeshBuffer.instance = SkinMeshBuffer.instance || new SkinMeshBuffer();
    }
    //TODO:coverage
    addSkinMesh(skinMesh) {
        //skinMesh.getData(vb, ib, vb.byteLength / 32);
        skinMesh.getData2(this.vb, this.ib, this.vb._byteLength / 32);
    }
    reset() {
        this.vb.clear();
        this.ib.clear();
    }
}
