import { LayaGL } from "../../layagl/LayaGL";
import { Buffer } from "../../webgl/utils/Buffer";
/**
 * <code>VertexBuffer3D</code> 类用于创建顶点缓冲。
 */
export class VertexBuffer3D extends Buffer {
    /**
     * 创建一个 <code>VertexBuffer3D</code> 实例。
     * @param	byteLength 字节长度。
     * @param	bufferUsage VertexBuffer3D用途类型。
     * @param	canRead 是否可读。
     */
    constructor(byteLength, bufferUsage, canRead = false) {
        super();
        /** @internal */
        this._vertexDeclaration = null;
        /** @internal */
        this._float32Reader = null;
        var gl = LayaGL.instance;
        this._bufferUsage = bufferUsage;
        this._bufferType = gl.ARRAY_BUFFER;
        this._canRead = canRead;
        this._byteLength = byteLength;
        this.bind();
        gl.bufferData(this._bufferType, this._byteLength, this._bufferUsage);
        if (canRead) {
            this._buffer = new Uint8Array(byteLength);
            this._float32Reader = new Float32Array(this._buffer.buffer);
        }
    }
    /**
     * 获取顶点声明。
     */
    get vertexDeclaration() {
        return this._vertexDeclaration;
    }
    set vertexDeclaration(value) {
        this._vertexDeclaration = value;
    }
    /**
     * 是否可读。
     */
    get canRead() {
        return this._canRead;
    }
    /**
     * @inheritDoc
     * @override
     */
    bind() {
        if (Buffer._bindedVertexBuffer !== this._glBuffer) {
            var gl = LayaGL.instance;
            gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
            Buffer._bindedVertexBuffer = this._glBuffer;
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * 设置数据。
     * @param	data 顶点数据。
     * @param	bufferOffset 顶点缓冲中的偏移,以字节为单位。
     * @param	dataStartIndex 顶点数据的偏移,以字节为单位。
     * @param	dataCount 顶点数据的长度,以字节为单位。
     */
    setData(buffer, bufferOffset = 0, dataStartIndex = 0, dataCount = Number.MAX_SAFE_INTEGER) {
        this.bind();
        var needSubData = dataStartIndex !== 0 || dataCount !== Number.MAX_SAFE_INTEGER;
        if (needSubData) {
            var subData = new Uint8Array(buffer, dataStartIndex, dataCount);
            LayaGL.instance.bufferSubData(this._bufferType, bufferOffset, subData);
            if (this._canRead)
                this._buffer.set(subData, bufferOffset);
        }
        else {
            LayaGL.instance.bufferSubData(this._bufferType, bufferOffset, buffer);
            if (this._canRead)
                this._buffer.set(new Uint8Array(buffer), bufferOffset);
        }
    }
    /**
     * 获取顶点数据。
     * @return	顶点数据。
     */
    getUint8Data() {
        if (this._canRead)
            return this._buffer;
        else
            throw new Error("Can't read data from VertexBuffer with only write flag!");
    }
    /**
     * @ignore
     */
    getFloat32Data() {
        if (this._canRead)
            return this._float32Reader;
        else
            throw new Error("Can't read data from VertexBuffer with only write flag!");
    }
    /**
     * @ignore
     */
    markAsUnreadbale() {
        this._canRead = false;
        this._buffer = null;
        this._float32Reader = null;
    }
    /**
     * @inheritDoc
     * @override
     */
    destroy() {
        super.destroy();
        this._buffer = null;
        this._float32Reader = null;
        this._vertexDeclaration = null;
    }
}
/**数据类型_Float32Array类型。*/
VertexBuffer3D.DATATYPE_FLOAT32ARRAY = 0;
/**数据类型_Uint8Array类型。*/
VertexBuffer3D.DATATYPE_UINT8ARRAY = 1;
