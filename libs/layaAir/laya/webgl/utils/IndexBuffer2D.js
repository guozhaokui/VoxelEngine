import { LayaGL } from "../../layagl/LayaGL";
import { Buffer } from "./Buffer";
import { Buffer2D } from "./Buffer2D";
export class IndexBuffer2D extends Buffer2D {
    constructor(bufferUsage = 0x88e4 /* WebGLContext.STATIC_DRAW*/) {
        super();
        this._bufferUsage = bufferUsage;
        this._bufferType = LayaGL.instance.ELEMENT_ARRAY_BUFFER;
        this._buffer = new ArrayBuffer(8);
    }
    /**
     * @override
     */
    _checkArrayUse() {
        this._uint16Array && (this._uint16Array = new Uint16Array(this._buffer));
    }
    getUint16Array() {
        return this._uint16Array || (this._uint16Array = new Uint16Array(this._buffer));
    }
    /**
     * @inheritDoc
     * @override
     */
    _bindForVAO() {
        var gl = LayaGL.instance;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glBuffer);
    }
    /**
     * @inheritDoc
     * @override
     */
    bind() {
        if (Buffer._bindedIndexBuffer !== this._glBuffer) {
            var gl = LayaGL.instance;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glBuffer);
            Buffer._bindedIndexBuffer = this._glBuffer;
            return true;
        }
        return false;
    }
    destory() {
        this._uint16Array = null;
        this._buffer = null;
    }
    disposeResource() {
        this._disposeResource();
    }
}
IndexBuffer2D.create = function (bufferUsage = 0x88e4 /* WebGLContext.STATIC_DRAW*/) {
    return new IndexBuffer2D(bufferUsage);
};
