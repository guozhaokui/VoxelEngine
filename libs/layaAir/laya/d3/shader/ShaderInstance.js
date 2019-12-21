import { LayaGL } from "../../layagl/LayaGL";
import { LayaGLRunner } from "../../layagl/LayaGLRunner";
import { Render } from "../../renders/Render";
import { Resource } from "../../resource/Resource";
import { Stat } from "../../utils/Stat";
import { WebGLContext } from "../../webgl/WebGLContext";
import { RenderState } from "../core/material/RenderState";
import { Shader3D } from "./Shader3D";
import { ShaderVariable } from "./ShaderVariable";
/**
 * @internal
 * <code>ShaderInstance</code> 类用于实现ShaderInstance。
 */
export class ShaderInstance extends Resource {
    /**
     * 创建一个 <code>ShaderInstance</code> 实例。
     */
    constructor(vs, ps, attributeMap, uniformMap, shaderPass) {
        super();
        /**@internal */
        this._stateParamsMap = [];
        /**@internal */
        this._uploadMark = -1;
        /** @internal */
        this._uploadRenderType = -1;
        this._vs = vs;
        this._ps = ps;
        this._attributeMap = attributeMap;
        this._uniformMap = uniformMap;
        this._shaderPass = shaderPass;
        this._create();
        this.lock = true;
    }
    /**
     *@internal
     */
    _create() {
        var gl = LayaGL.instance;
        this._program = gl.createProgram();
        this._vshader = this._createShader(gl, this._vs, gl.VERTEX_SHADER);
        this._pshader = this._createShader(gl, this._ps, gl.FRAGMENT_SHADER);
        gl.attachShader(this._program, this._vshader);
        gl.attachShader(this._program, this._pshader);
        for (var k in this._attributeMap) //根据声明调整location,便于VAO使用
            gl.bindAttribLocation(this._program, this._attributeMap[k], k);
        gl.linkProgram(this._program);
        if (!Render.isConchApp && Shader3D.debugMode && !gl.getProgramParameter(this._program, gl.LINK_STATUS))
            throw gl.getProgramInfoLog(this._program);
        var sceneParms = [];
        var cameraParms = [];
        var spriteParms = [];
        var materialParms = [];
        var customParms = [];
        this._customUniformParamsMap = [];
        var nUniformNum = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        WebGLContext.useProgram(gl, this._program);
        this._curActTexIndex = 0;
        var one, i, n;
        for (i = 0; i < nUniformNum; i++) {
            var uniformData = gl.getActiveUniform(this._program, i);
            var uniName = uniformData.name;
            one = new ShaderVariable();
            one.location = gl.getUniformLocation(this._program, uniName);
            if (uniName.indexOf('[0]') > 0) {
                one.name = uniName = uniName.substr(0, uniName.length - 3);
                one.isArray = true;
            }
            else {
                one.name = uniName;
                one.isArray = false;
            }
            one.type = uniformData.type;
            this._addShaderUnifiormFun(one);
            var uniformPeriod = this._uniformMap[uniName];
            if (uniformPeriod != null) {
                one.dataOffset = Shader3D.propertyNameToID(uniName);
                switch (uniformPeriod) {
                    case Shader3D.PERIOD_CUSTOM:
                        customParms.push(one);
                        break;
                    case Shader3D.PERIOD_MATERIAL:
                        materialParms.push(one);
                        break;
                    case Shader3D.PERIOD_SPRITE:
                        spriteParms.push(one);
                        break;
                    case Shader3D.PERIOD_CAMERA:
                        cameraParms.push(one);
                        break;
                    case Shader3D.PERIOD_SCENE:
                        sceneParms.push(one);
                        break;
                    default:
                        throw new Error("Shader3D: period is unkonw.");
                }
            }
        }
        //Native版本分别存入funid、webglFunid,location、type、offset, +4是因为第一个存长度了 所以是*4*5+4
        this._sceneUniformParamsMap = LayaGL.instance.createCommandEncoder(sceneParms.length * 4 * 5 + 4, 64, true);
        for (i = 0, n = sceneParms.length; i < n; i++)
            this._sceneUniformParamsMap.addShaderUniform(sceneParms[i]);
        this._cameraUniformParamsMap = LayaGL.instance.createCommandEncoder(cameraParms.length * 4 * 5 + 4, 64, true);
        for (i = 0, n = cameraParms.length; i < n; i++)
            this._cameraUniformParamsMap.addShaderUniform(cameraParms[i]);
        this._spriteUniformParamsMap = LayaGL.instance.createCommandEncoder(spriteParms.length * 4 * 5 + 4, 64, true);
        for (i = 0, n = spriteParms.length; i < n; i++)
            this._spriteUniformParamsMap.addShaderUniform(spriteParms[i]);
        this._materialUniformParamsMap = LayaGL.instance.createCommandEncoder(materialParms.length * 4 * 5 + 4, 64, true);
        for (i = 0, n = materialParms.length; i < n; i++)
            this._materialUniformParamsMap.addShaderUniform(materialParms[i]);
        this._customUniformParamsMap.length = customParms.length;
        for (i = 0, n = customParms.length; i < n; i++) {
            var custom = customParms[i];
            this._customUniformParamsMap[custom.dataOffset] = custom;
        }
        var stateMap = this._shaderPass._stateMap;
        for (var s in stateMap)
            this._stateParamsMap[stateMap[s]] = Shader3D.propertyNameToID(s);
    }
    /**
     * @internal
     */
    _getRenderState(shaderDatas, stateIndex) {
        var stateID = this._stateParamsMap[stateIndex];
        if (stateID == null)
            return null;
        else
            return shaderDatas[stateID];
    }
    /**
     * @inheritDoc
     * @override
     */
    _disposeResource() {
        LayaGL.instance.deleteShader(this._vshader);
        LayaGL.instance.deleteShader(this._pshader);
        LayaGL.instance.deleteProgram(this._program);
        this._vshader = this._pshader = this._program = null;
        this._setGPUMemory(0);
        this._curActTexIndex = 0;
    }
    /**
     * @internal
     */
    _addShaderUnifiormFun(one) {
        var gl = LayaGL.instance;
        one.caller = this;
        var isArray = one.isArray;
        switch (one.type) {
            case gl.BOOL:
                one.fun = this._uniform1i;
                one.uploadedValue = new Array(1);
                break;
            case gl.INT:
                one.fun = isArray ? this._uniform1iv : this._uniform1i; //TODO:优化
                one.uploadedValue = new Array(1);
                break;
            case gl.FLOAT:
                one.fun = isArray ? this._uniform1fv : this._uniform1f;
                one.uploadedValue = new Array(1);
                break;
            case gl.FLOAT_VEC2:
                one.fun = isArray ? this._uniform_vec2v : this._uniform_vec2;
                one.uploadedValue = new Array(2);
                break;
            case gl.FLOAT_VEC3:
                one.fun = isArray ? this._uniform_vec3v : this._uniform_vec3;
                one.uploadedValue = new Array(3);
                break;
            case gl.FLOAT_VEC4:
                one.fun = isArray ? this._uniform_vec4v : this._uniform_vec4;
                one.uploadedValue = new Array(4);
                break;
            case gl.FLOAT_MAT2:
                one.fun = this._uniformMatrix2fv;
                break;
            case gl.FLOAT_MAT3:
                one.fun = this._uniformMatrix3fv;
                break;
            case gl.FLOAT_MAT4:
                one.fun = isArray ? this._uniformMatrix4fv : this._uniformMatrix4f;
                break;
            case gl.SAMPLER_2D:
                gl.uniform1i(one.location, this._curActTexIndex);
                one.textureID = WebGLContext._glTextureIDs[this._curActTexIndex++];
                one.fun = this._uniform_sampler2D;
                break;
            case 0x8b5f: //sampler3D
                gl.uniform1i(one.location, this._curActTexIndex);
                one.textureID = WebGLContext._glTextureIDs[this._curActTexIndex++];
                one.fun = this._uniform_sampler3D;
                break;
            case gl.SAMPLER_CUBE:
                gl.uniform1i(one.location, this._curActTexIndex);
                one.textureID = WebGLContext._glTextureIDs[this._curActTexIndex++];
                one.fun = this._uniform_samplerCube;
                break;
            default:
                throw new Error("compile shader err!");
                break;
        }
    }
    /**
     * @internal
     */
    _createShader(gl, str, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (Shader3D.debugMode && !gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw gl.getShaderInfoLog(shader);
        return shader;
    }
    /**
     * @internal
     */
    _uniform1f(one, value) {
        var uploadedValue = one.uploadedValue;
        if (uploadedValue[0] !== value) {
            LayaGL.instance.uniform1f(one.location, uploadedValue[0] = value);
            return 1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _uniform1fv(one, value) {
        if (value.length < 4) {
            var uploadedValue = one.uploadedValue;
            if (uploadedValue[0] !== value[0] || uploadedValue[1] !== value[1] || uploadedValue[2] !== value[2] || uploadedValue[3] !== value[3]) {
                LayaGL.instance.uniform1fv(one.location, value);
                uploadedValue[0] = value[0];
                uploadedValue[1] = value[1];
                uploadedValue[2] = value[2];
                uploadedValue[3] = value[3];
                return 1;
            }
            return 0;
        }
        else {
            LayaGL.instance.uniform1fv(one.location, value);
            return 1;
        }
    }
    /**
     * @internal
     */
    _uniform_vec2(one, v) {
        var uploadedValue = one.uploadedValue;
        if (uploadedValue[0] !== v.x || uploadedValue[1] !== v.y) {
            LayaGL.instance.uniform2f(one.location, uploadedValue[0] = v.x, uploadedValue[1] = v.y);
            return 1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _uniform_vec2v(one, value) {
        if (value.length < 2) {
            var uploadedValue = one.uploadedValue;
            if (uploadedValue[0] !== value[0] || uploadedValue[1] !== value[1] || uploadedValue[2] !== value[2] || uploadedValue[3] !== value[3]) {
                LayaGL.instance.uniform2fv(one.location, value);
                uploadedValue[0] = value[0];
                uploadedValue[1] = value[1];
                uploadedValue[2] = value[2];
                uploadedValue[3] = value[3];
                return 1;
            }
            return 0;
        }
        else {
            LayaGL.instance.uniform2fv(one.location, value);
            return 1;
        }
    }
    /**
     * @internal
     */
    _uniform_vec3(one, v) {
        var uploadedValue = one.uploadedValue;
        if (uploadedValue[0] !== v.x || uploadedValue[1] !== v.y || uploadedValue[2] !== v.z) {
            LayaGL.instance.uniform3f(one.location, uploadedValue[0] = v.x, uploadedValue[1] = v.y, uploadedValue[2] = v.z);
            return 1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _uniform_vec3v(one, v) {
        LayaGL.instance.uniform3fv(one.location, v);
        return 1;
    }
    /**
     * @internal
     */
    _uniform_vec4(one, v) {
        var uploadedValue = one.uploadedValue;
        if (uploadedValue[0] !== v.x || uploadedValue[1] !== v.y || uploadedValue[2] !== v.z || uploadedValue[3] !== v.w) {
            LayaGL.instance.uniform4f(one.location, uploadedValue[0] = v.x, uploadedValue[1] = v.y, uploadedValue[2] = v.z, uploadedValue[3] = v.w);
            return 1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _uniform_vec4v(one, v) {
        LayaGL.instance.uniform4fv(one.location, v);
        return 1;
    }
    /**
     * @internal
     */
    _uniformMatrix2fv(one, value) {
        LayaGL.instance.uniformMatrix2fv(one.location, false, value);
        return 1;
    }
    /**
     * @internal
     */
    _uniformMatrix3fv(one, value) {
        LayaGL.instance.uniformMatrix3fv(one.location, false, value);
        return 1;
    }
    /**
     * @internal
     */
    _uniformMatrix4f(one, m) {
        var value = m.elements;
        LayaGL.instance.uniformMatrix4fv(one.location, false, value);
        return 1;
    }
    /**
     * @internal
     */
    _uniformMatrix4fv(one, m) {
        LayaGL.instance.uniformMatrix4fv(one.location, false, m);
        return 1;
    }
    /**
     * @internal
     */
    _uniform1i(one, value) {
        var uploadedValue = one.uploadedValue;
        if (uploadedValue[0] !== value) {
            LayaGL.instance.uniform1i(one.location, uploadedValue[0] = value);
            return 1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _uniform1iv(one, value) {
        LayaGL.instance.uniform1iv(one.location, value);
        return 1;
    }
    /**
     * @internal
     */
    _uniform_ivec2(one, value) {
        var uploadedValue = one.uploadedValue;
        if (uploadedValue[0] !== value[0] || uploadedValue[1] !== value[1]) {
            LayaGL.instance.uniform2i(one.location, uploadedValue[0] = value[0], uploadedValue[1] = value[1]);
            return 1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _uniform_ivec2v(one, value) {
        LayaGL.instance.uniform2iv(one.location, value);
        return 1;
    }
    /**
     * @internal
     */
    _uniform_vec3i(one, value) {
        var uploadedValue = one.uploadedValue;
        if (uploadedValue[0] !== value[0] || uploadedValue[1] !== value[1] || uploadedValue[2] !== value[2]) {
            LayaGL.instance.uniform3i(one.location, uploadedValue[0] = value[0], uploadedValue[1] = value[1], uploadedValue[2] = value[2]);
            return 1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _uniform_vec3vi(one, value) {
        LayaGL.instance.uniform3iv(one.location, value);
        return 1;
    }
    /**
     * @internal
     */
    _uniform_vec4i(one, value) {
        var uploadedValue = one.uploadedValue;
        if (uploadedValue[0] !== value[0] || uploadedValue[1] !== value[1] || uploadedValue[2] !== value[2] || uploadedValue[3] !== value[3]) {
            LayaGL.instance.uniform4i(one.location, uploadedValue[0] = value[0], uploadedValue[1] = value[1], uploadedValue[2] = value[2], uploadedValue[3] = value[3]);
            return 1;
        }
        return 0;
    }
    /**
     * @internal
     */
    _uniform_vec4vi(one, value) {
        LayaGL.instance.uniform4iv(one.location, value);
        return 1;
    }
    /**
     * @internal
     */
    _uniform_sampler2D(one, texture) {
        var value = texture._getSource() || texture.defaulteTexture._getSource();
        var gl = LayaGL.instance;
        WebGLContext.activeTexture(gl, one.textureID);
        WebGLContext.bindTexture(gl, gl.TEXTURE_2D, value);
        return 0;
    }
    _uniform_sampler3D(one, texture) {
        var value = texture._getSource() || texture.defaulteTexture._getSource();
        var gl = LayaGL.instance;
        WebGLContext.activeTexture(gl, one.textureID);
        WebGLContext.bindTexture(gl, WebGL2RenderingContext.TEXTURE_3D, value);
        return 0;
    }
    /**
     * @internal
     */
    _uniform_samplerCube(one, texture) {
        var value = texture._getSource() || texture.defaulteTexture._getSource();
        var gl = LayaGL.instance;
        WebGLContext.activeTexture(gl, one.textureID);
        WebGLContext.bindTexture(gl, gl.TEXTURE_CUBE_MAP, value);
        return 0;
    }
    /**
     * @internal
     */
    bind() {
        return WebGLContext.useProgram(LayaGL.instance, this._program);
    }
    /**
     * @internal
     */
    uploadUniforms(shaderUniform, shaderDatas, uploadUnTexture) {
        Stat.shaderCall += LayaGLRunner.uploadShaderUniforms(LayaGL.instance, shaderUniform, shaderDatas, uploadUnTexture);
    }
    /**
     * @internal
     */
    uploadRenderStateBlendDepth(shaderDatas) {
        var gl = LayaGL.instance;
        var renderState = this._shaderPass.renderState;
        var datas = shaderDatas.getData();
        var depthWrite = this._getRenderState(datas, Shader3D.RENDER_STATE_DEPTH_WRITE);
        var depthTest = this._getRenderState(datas, Shader3D.RENDER_STATE_DEPTH_TEST);
        var blend = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND);
        depthWrite == null && (depthWrite = renderState.depthWrite);
        depthTest == null && (depthTest = renderState.depthTest);
        blend == null && (blend = renderState.blend);
        WebGLContext.setDepthMask(gl, depthWrite);
        if (depthTest === RenderState.DEPTHTEST_OFF)
            WebGLContext.setDepthTest(gl, false);
        else {
            WebGLContext.setDepthTest(gl, true);
            WebGLContext.setDepthFunc(gl, depthTest);
        }
        switch (blend) {
            case RenderState.BLEND_DISABLE:
                WebGLContext.setBlend(gl, false);
                break;
            case RenderState.BLEND_ENABLE_ALL:
                var blendEquation = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_EQUATION);
                var srcBlend = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_SRC);
                var dstBlend = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_DST);
                blendEquation == null && (blendEquation = renderState.blendEquation);
                srcBlend == null && (srcBlend = renderState.srcBlend);
                dstBlend == null && (dstBlend = renderState.dstBlend);
                WebGLContext.setBlend(gl, true);
                WebGLContext.setBlendEquation(gl, blendEquation);
                WebGLContext.setBlendFunc(gl, srcBlend, dstBlend);
                break;
            case RenderState.BLEND_ENABLE_SEPERATE:
                var blendEquationRGB = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_EQUATION_RGB);
                var blendEquationAlpha = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_EQUATION_ALPHA);
                var srcRGB = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_SRC_RGB);
                var dstRGB = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_DST_RGB);
                var srcAlpha = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_SRC_ALPHA);
                var dstAlpha = this._getRenderState(datas, Shader3D.RENDER_STATE_BLEND_DST_ALPHA);
                blendEquationRGB == null && (blendEquationRGB = renderState.blendEquationRGB);
                blendEquationAlpha == null && (blendEquationAlpha = renderState.blendEquationAlpha);
                srcRGB == null && (srcRGB = renderState.srcBlendRGB);
                dstRGB == null && (dstRGB = renderState.dstBlendRGB);
                srcAlpha == null && (srcAlpha = renderState.srcBlendAlpha);
                dstAlpha == null && (dstAlpha = renderState.dstBlendAlpha);
                WebGLContext.setBlend(gl, true);
                WebGLContext.setBlendEquationSeparate(gl, blendEquationRGB, blendEquationAlpha);
                WebGLContext.setBlendFuncSeperate(gl, srcRGB, dstRGB, srcAlpha, dstAlpha);
                break;
        }
    }
    /**
     * @internal
     */
    uploadRenderStateFrontFace(shaderDatas, isTarget, invertFront) {
        var gl = LayaGL.instance;
        var renderState = this._shaderPass.renderState;
        var datas = shaderDatas.getData();
        var cull = this._getRenderState(datas, Shader3D.RENDER_STATE_CULL);
        cull == null && (cull = renderState.cull);
        var forntFace;
        switch (cull) {
            case RenderState.CULL_NONE:
                WebGLContext.setCullFace(gl, false);
                break;
            case RenderState.CULL_FRONT:
                WebGLContext.setCullFace(gl, true);
                //forntFace = isTarget ? invertFront ? WebGLContext.CCW : WebGLContext.CW : invertFront ? WebGLContext.CW : WebGLContext.CCW;
                if (isTarget) {
                    if (invertFront)
                        forntFace = gl.CCW;
                    else
                        forntFace = gl.CW;
                }
                else {
                    if (invertFront)
                        forntFace = gl.CW;
                    else
                        forntFace = gl.CCW;
                }
                WebGLContext.setFrontFace(gl, forntFace);
                break;
            case RenderState.CULL_BACK:
                WebGLContext.setCullFace(gl, true);
                if (isTarget) {
                    if (invertFront)
                        forntFace = gl.CW;
                    else
                        forntFace = gl.CCW;
                }
                else {
                    if (invertFront)
                        forntFace = gl.CCW;
                    else
                        forntFace = gl.CW;
                }
                WebGLContext.setFrontFace(gl, forntFace);
                break;
        }
    }
    /**
     * @internal
     */
    uploadCustomUniform(index, data) {
        Stat.shaderCall += LayaGLRunner.uploadCustomUniform(LayaGL.instance, this._customUniformParamsMap, index, data);
    }
    /**
     * @internal
     * [NATIVE]
     */
    _uniformMatrix2fvForNative(one, value) {
        LayaGL.instance.uniformMatrix2fvEx(one.location, false, value);
        return 1;
    }
    /**
     * @internal
     * [NATIVE]
     */
    _uniformMatrix3fvForNative(one, value) {
        LayaGL.instance.uniformMatrix3fvEx(one.location, false, value);
        return 1;
    }
    /**
     * @internal
     * [NATIVE]
     */
    _uniformMatrix4fvForNative(one, m) {
        LayaGL.instance.uniformMatrix4fvEx(one.location, false, m);
        return 1;
    }
}
