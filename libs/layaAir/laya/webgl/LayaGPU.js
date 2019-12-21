import { ILaya } from "../../ILaya";
import { VertexArrayObject } from "../../laya/webgl/VertexArrayObject";
import { SystemUtils } from "../d3/utils/SystemUtils";
/**
 * @internal
 */
export class LayaGPU {
    /**
     * @internal
     */
    constructor(gl, isWebGL2) {
        /**@internal */
        this._gl = null;
        /**@internal */
        this._vaoExt = null;
        /**@internal */
        this._angleInstancedArrays = null;
        /**@internal */
        this._isWebGL2 = false;
        /**@internal */
        this._oesTextureHalfFloat = null;
        /**@internal */
        this._oes_element_index_uint = null;
        /**@internal */
        this._oesTextureHalfFloatLinear = null;
        /**@internal */
        this._oesTextureFloat = null;
        /**@internal */
        this._extShaderTextureLod = null;
        /**@internal */
        this._extTextureFilterAnisotropic = null;
        /**@internal */
        this._compressedTextureS3tc = null;
        /**@internal */
        this._compressedTexturePvrtc = null;
        /**@internal */
        this._compressedTextureEtc1 = null;
        this._gl = gl;
        this._isWebGL2 = isWebGL2;
        var maxTextureCountFS = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (!isWebGL2) {
            var forceVAO = LayaGPU._forceSupportVAOPlatform();
            if (!ILaya.Render.isConchApp) {
                VertexArrayObject; //强制引用
                if (window._setupVertexArrayObject) { //兼容VAO
                    if (forceVAO)
                        window._forceSetupVertexArrayObject(gl);
                    else
                        window._setupVertexArrayObject(gl);
                }
            }
            this._vaoExt = this._getExtension("OES_vertex_array_object");
            if (!forceVAO)
                this._angleInstancedArrays = this._getExtension("ANGLE_instanced_arrays"); //forceVAO会导致Instance有BUG
            this._oesTextureHalfFloat = this._getExtension("OES_texture_half_float");
            this._oesTextureHalfFloatLinear = this._getExtension("OES_texture_half_float_linear");
            this._oesTextureFloat = this._getExtension("OES_texture_float");
            //this._getExtension("OES_texture_float_linear");
            this._oes_element_index_uint = this._getExtension("OES_element_index_uint");
            this._extShaderTextureLod = this._getExtension("EXT_shader_texture_lod");
            //TODO:
            var maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);
            if (maxVaryingVectors >= 10 && maxTextureCountFS >= 16 && maxTextureSize >= 4096 && this._extShaderTextureLod)
                SystemUtils._shaderCapailityLevel = 30;
            else
                SystemUtils._shaderCapailityLevel = 20;
        }
        else {
            this._getExtension("EXT_color_buffer_float");
            //this._getExtension("OES_texture_float_linear");
            //TODO:
            SystemUtils._shaderCapailityLevel = 30;
        }
        //_getExtension("EXT_float_blend");
        this._extTextureFilterAnisotropic = this._getExtension("EXT_texture_filter_anisotropic");
        this._compressedTextureS3tc = this._getExtension("WEBGL_compressed_texture_s3tc");
        this._compressedTexturePvrtc = this._getExtension("WEBGL_compressed_texture_pvrtc");
        this._compressedTextureEtc1 = this._getExtension("WEBGL_compressed_texture_etc1");
        SystemUtils._maxTextureCount = maxTextureCountFS;
        SystemUtils._maxTextureSize = maxTextureSize;
    }
    /**
     * @internal
     */
    static _forceSupportVAOPlatform() {
        let Browser = ILaya.Browser;
        return Browser.onBDMiniGame || Browser.onQGMiniGame;
    }
    /**
     * @internal
     */
    _getExtension(name) {
        var prefixes = LayaGPU._extentionVendorPrefixes;
        for (var k in prefixes) {
            var ext = this._gl.getExtension(prefixes[k] + name);
            if (ext)
                return ext;
        }
        return null;
    }
    /**
     * @internal
     */
    createVertexArray() {
        if (this._isWebGL2)
            return this._gl.createVertexArray();
        else
            return this._vaoExt.createVertexArrayOES();
    }
    /**
     * @internal
     */
    bindVertexArray(vertexArray) {
        if (this._isWebGL2)
            this._gl.bindVertexArray(vertexArray);
        else
            this._vaoExt.bindVertexArrayOES(vertexArray);
    }
    /**
     * @internal
     */
    deleteVertexArray(vertexArray) {
        if (this._isWebGL2)
            this._gl.deleteVertexArray(vertexArray);
        else
            this._vaoExt.deleteVertexArrayOES(vertexArray);
    }
    /**
     * @internal
     */
    isVertexArray(vertexArray) {
        if (this._isWebGL2)
            this._gl.isVertexArray(vertexArray);
        else
            this._vaoExt.isVertexArrayOES(vertexArray);
    }
    /**
     * @internal
     */
    drawElementsInstanced(mode, count, type, offset, instanceCount) {
        if (this._isWebGL2)
            this._gl.drawElementsInstanced(mode, count, type, offset, instanceCount);
        else
            this._angleInstancedArrays.drawElementsInstancedANGLE(mode, count, type, offset, instanceCount);
    }
    /**
     * @internal
     */
    drawArraysInstanced(mode, first, count, instanceCount) {
        if (this._isWebGL2)
            this._gl.drawArraysInstanced(mode, first, count, instanceCount);
        else
            this._angleInstancedArrays.drawArraysInstancedANGLE(mode, first, count, instanceCount);
    }
    /**
     * @internal
     */
    vertexAttribDivisor(index, divisor) {
        if (this._isWebGL2)
            this._gl.vertexAttribDivisor(index, divisor);
        else
            this._angleInstancedArrays.vertexAttribDivisorANGLE(index, divisor);
    }
    /**
     * @internal
     */
    supportInstance() {
        if (this._isWebGL2 || this._angleInstancedArrays)
            return true;
        else
            return false;
    }
    /**
    * @internal
    */
    supportElementIndexUint32() {
        return this._isWebGL2 || this._oes_element_index_uint ? true : false;
    }
}
/**@internal */
LayaGPU._extentionVendorPrefixes = ["", "WEBKIT_", "MOZ_"];
