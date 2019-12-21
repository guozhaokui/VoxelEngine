import { IndexBuffer3D } from "../graphics/IndexBuffer3D";
import { VertexMesh } from "../graphics/Vertex/VertexMesh";
import { VertexBuffer3D } from "../graphics/VertexBuffer3D";
import { Matrix4x4 } from "../math/Matrix4x4";
import { skinnedMatrixCache } from "../resource/models/Mesh";
import { SubMesh } from "../resource/models/SubMesh";
import { LayaGL } from "../../layagl/LayaGL";
import { IndexFormat } from "../graphics/IndexFormat";
/**
 * @internal
 * <code>LoadModel</code> 类用于模型加载。
 */
export class LoadModelV04 {
    /**
     * @internal
     */
    static parse(readData, version, mesh, subMeshes) {
        LoadModelV04._mesh = mesh;
        LoadModelV04._subMeshes = subMeshes;
        LoadModelV04._version = version;
        LoadModelV04._readData = readData;
        LoadModelV04.READ_DATA();
        LoadModelV04.READ_BLOCK();
        LoadModelV04.READ_STRINGS();
        for (var i = 0, n = LoadModelV04._BLOCK.count; i < n; i++) {
            LoadModelV04._readData.pos = LoadModelV04._BLOCK.blockStarts[i];
            var index = LoadModelV04._readData.getUint16();
            var blockName = LoadModelV04._strings[index];
            var fn = LoadModelV04["READ_" + blockName];
            if (fn == null)
                throw new Error("model file err,no this function:" + index + " " + blockName);
            else
                fn.call(null);
        }
        LoadModelV04._strings.length = 0;
        LoadModelV04._readData = null;
        LoadModelV04._version = null;
        LoadModelV04._mesh = null;
        LoadModelV04._subMeshes = null;
    }
    /**
     * @internal
     */
    static _readString() {
        return LoadModelV04._strings[LoadModelV04._readData.getUint16()];
    }
    /**
     * @internal
     */
    static READ_DATA() {
        LoadModelV04._DATA.offset = LoadModelV04._readData.getUint32();
        LoadModelV04._DATA.size = LoadModelV04._readData.getUint32();
    }
    /**
     * @internal
     */
    static READ_BLOCK() {
        var count = LoadModelV04._BLOCK.count = LoadModelV04._readData.getUint16();
        var blockStarts = LoadModelV04._BLOCK.blockStarts = [];
        var blockLengths = LoadModelV04._BLOCK.blockLengths = [];
        for (var i = 0; i < count; i++) {
            blockStarts.push(LoadModelV04._readData.getUint32());
            blockLengths.push(LoadModelV04._readData.getUint32());
        }
    }
    /**
     * @internal
     */
    static READ_STRINGS() {
        var offset = LoadModelV04._readData.getUint32();
        var count = LoadModelV04._readData.getUint16();
        var prePos = LoadModelV04._readData.pos;
        LoadModelV04._readData.pos = offset + LoadModelV04._DATA.offset;
        for (var i = 0; i < count; i++)
            LoadModelV04._strings[i] = LoadModelV04._readData.readUTFString();
        LoadModelV04._readData.pos = prePos;
    }
    /**
     * @internal
     */
    static READ_MESH() {
        var gl = LayaGL.instance;
        var name = LoadModelV04._readString();
        var arrayBuffer = LoadModelV04._readData.__getBuffer();
        var i, n;
        var memorySize = 0;
        var vertexBufferCount = LoadModelV04._readData.getInt16();
        var offset = LoadModelV04._DATA.offset;
        for (i = 0; i < vertexBufferCount; i++) { //TODO:始终为1
            var vbStart = offset + LoadModelV04._readData.getUint32();
            var vbLength = LoadModelV04._readData.getUint32();
            var vbArrayBuffer = arrayBuffer.slice(vbStart, vbStart + vbLength);
            var vbDatas = new Float32Array(vbArrayBuffer);
            var bufferAttribute = LoadModelV04._readString();
            var vertexDeclaration;
            switch (LoadModelV04._version) {
                case "LAYAMODEL:0301":
                case "LAYAMODEL:0400":
                    vertexDeclaration = VertexMesh.getVertexDeclaration(bufferAttribute);
                    break;
                case "LAYAMODEL:0401":
                    vertexDeclaration = VertexMesh.getVertexDeclaration(bufferAttribute, false);
                    break;
                default:
                    throw new Error("LoadModelV03: unknown version.");
            }
            if (!vertexDeclaration)
                throw new Error("LoadModelV03: unknown vertexDeclaration.");
            var vertexBuffer = new VertexBuffer3D(vbDatas.length * 4, gl.STATIC_DRAW, true);
            vertexBuffer.vertexDeclaration = vertexDeclaration;
            vertexBuffer.setData(vbDatas.buffer);
            LoadModelV04._mesh._vertexBuffer = vertexBuffer;
            LoadModelV04._mesh._vertexCount += vertexBuffer._byteLength / vertexDeclaration.vertexStride;
            memorySize += vbDatas.length * 4;
        }
        var ibStart = offset + LoadModelV04._readData.getUint32();
        var ibLength = LoadModelV04._readData.getUint32();
        var ibDatas = new Uint16Array(arrayBuffer.slice(ibStart, ibStart + ibLength));
        var indexBuffer = new IndexBuffer3D(IndexFormat.UInt16, ibLength / 2, gl.STATIC_DRAW, true);
        indexBuffer.setData(ibDatas);
        LoadModelV04._mesh._indexBuffer = indexBuffer;
        memorySize += indexBuffer.indexCount * 2;
        LoadModelV04._mesh._setBuffer(LoadModelV04._mesh._vertexBuffer, indexBuffer);
        LoadModelV04._mesh._setCPUMemory(memorySize);
        LoadModelV04._mesh._setGPUMemory(memorySize);
        var boneNames = LoadModelV04._mesh._boneNames = [];
        var boneCount = LoadModelV04._readData.getUint16();
        boneNames.length = boneCount;
        for (i = 0; i < boneCount; i++)
            boneNames[i] = LoadModelV04._strings[LoadModelV04._readData.getUint16()];
        LoadModelV04._readData.pos += 8; //TODO:优化
        var bindPoseDataStart = LoadModelV04._readData.getUint32();
        var bindPoseDataLength = LoadModelV04._readData.getUint32();
        var bindPoseDatas = new Float32Array(arrayBuffer.slice(offset + bindPoseDataStart, offset + bindPoseDataStart + bindPoseDataLength));
        var bindPoseFloatCount = bindPoseDatas.length;
        var bindPoseCount = bindPoseFloatCount / 16;
        var bindPoseBuffer = LoadModelV04._mesh._inverseBindPosesBuffer = new ArrayBuffer(bindPoseFloatCount * 4); //TODO:[NATIVE]临时
        LoadModelV04._mesh._inverseBindPoses = [];
        for (i = 0; i < bindPoseFloatCount; i += 16) {
            var inverseGlobalBindPose = new Matrix4x4(bindPoseDatas[i + 0], bindPoseDatas[i + 1], bindPoseDatas[i + 2], bindPoseDatas[i + 3], bindPoseDatas[i + 4], bindPoseDatas[i + 5], bindPoseDatas[i + 6], bindPoseDatas[i + 7], bindPoseDatas[i + 8], bindPoseDatas[i + 9], bindPoseDatas[i + 10], bindPoseDatas[i + 11], bindPoseDatas[i + 12], bindPoseDatas[i + 13], bindPoseDatas[i + 14], bindPoseDatas[i + 15], new Float32Array(bindPoseBuffer, i * 4, 16));
            LoadModelV04._mesh._inverseBindPoses[i / 16] = inverseGlobalBindPose;
        }
        return true;
    }
    /**
     * @internal
     */
    static READ_SUBMESH() {
        var arrayBuffer = LoadModelV04._readData.__getBuffer();
        var subMesh = new SubMesh(LoadModelV04._mesh);
        LoadModelV04._readData.getInt16(); //TODO:vbIndex
        LoadModelV04._readData.getUint32(); //TODO:vbStart
        LoadModelV04._readData.getUint32(); //TODO:vbLength
        var ibStart = LoadModelV04._readData.getUint32();
        var ibCount = LoadModelV04._readData.getUint32();
        var indexBuffer = LoadModelV04._mesh._indexBuffer;
        subMesh._indexBuffer = indexBuffer;
        subMesh._setIndexRange(ibStart, ibCount);
        var vertexBuffer = LoadModelV04._mesh._vertexBuffer;
        subMesh._vertexBuffer = vertexBuffer;
        var offset = LoadModelV04._DATA.offset;
        var subIndexBufferStart = subMesh._subIndexBufferStart;
        var subIndexBufferCount = subMesh._subIndexBufferCount;
        var boneIndicesList = subMesh._boneIndicesList;
        var drawCount = LoadModelV04._readData.getUint16();
        subIndexBufferStart.length = drawCount;
        subIndexBufferCount.length = drawCount;
        boneIndicesList.length = drawCount;
        var skinnedCache = LoadModelV04._mesh._skinnedMatrixCaches;
        var subMeshIndex = LoadModelV04._subMeshes.length;
        skinnedCache.length = LoadModelV04._mesh._inverseBindPoses.length;
        for (var i = 0; i < drawCount; i++) {
            subIndexBufferStart[i] = LoadModelV04._readData.getUint32();
            subIndexBufferCount[i] = LoadModelV04._readData.getUint32();
            var boneDicofs = LoadModelV04._readData.getUint32();
            var boneDicCount = LoadModelV04._readData.getUint32();
            var boneIndices = boneIndicesList[i] = new Uint16Array(arrayBuffer.slice(offset + boneDicofs, offset + boneDicofs + boneDicCount));
            var boneIndexCount = boneIndices.length;
            for (var j = 0; j < boneIndexCount; j++) {
                var index = boneIndices[j];
                skinnedCache[index] || (skinnedCache[index] = new skinnedMatrixCache(subMeshIndex, i, j));
            }
        }
        LoadModelV04._subMeshes.push(subMesh);
        return true;
    }
}
/**@internal */
LoadModelV04._BLOCK = { count: 0 };
/**@internal */
LoadModelV04._DATA = { offset: 0, size: 0 };
/**@internal */
LoadModelV04._strings = [];
