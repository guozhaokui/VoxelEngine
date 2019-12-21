import { ILaya } from "../../../ILaya";
import { RenderTextureDepthFormat } from "../../resource/RenderTextureFormat";
import { Texture2D } from "../../resource/Texture2D";
import { PostProcessRenderContext } from "../core/render/PostProcessRenderContext";
import { RenderContext3D } from "../core/render/RenderContext3D";
import { RenderTexture } from "../resource/RenderTexture";
import { Shader3D } from "../shader/Shader3D";
import { ShaderData } from "../shader/ShaderData";
/**
 * <code>PostProcess</code> 类用于创建后期处理组件。
 */
export class PostProcess {
    /**
     * 创建一个 <code>PostProcess</code> 实例。
     */
    constructor() {
        /**@internal */
        this._compositeShader = Shader3D.find("PostProcessComposite");
        /**@internal */
        this._compositeShaderData = new ShaderData();
        /**@internal */
        this._effects = [];
        /**@internal */
        this._context = null;
        this._context = new PostProcessRenderContext();
        this._context.compositeShaderData = this._compositeShaderData;
    }
    /**
     * @internal
     */
    static __init__() {
        PostProcess.SHADERDEFINE_BLOOM_LOW = Shader3D.getDefineByName("BLOOM_LOW");
        PostProcess.SHADERDEFINE_BLOOM = Shader3D.getDefineByName("BLOOM");
        PostProcess.SHADERDEFINE_FINALPASS = Shader3D.getDefineByName("FINALPASS");
    }
    /**
     *@internal
     */
    _init(camera, command) {
        this._context.camera = camera;
        this._context.command = command;
    }
    /**
     * @internal
     */
    _render() {
        var noteValue = ShaderData._SET_RUNTIME_VALUE_MODE_REFERENCE_;
        ILaya.Render.supportWebGLPlusRendering && ShaderData.setRuntimeValueMode(false);
        var camera = this._context.camera;
        var viewport = camera.viewport;
        var screenTexture = RenderTexture.createFromPool(RenderContext3D.clientWidth, RenderContext3D.clientHeight, camera._getRenderTextureFormat(), RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        var cameraTarget = camera._internalRenderTexture;
        this._context.command.clear();
        this._context.source = screenTexture;
        this._context.destination = cameraTarget;
        this._context.compositeShaderData.clearDefine();
        this._context.command.blitScreenTriangle(cameraTarget, screenTexture);
        this._context.compositeShaderData.setTexture(PostProcess.SHADERVALUE_AUTOEXPOSURETEX, Texture2D.whiteTexture); //TODO:
        for (var i = 0, n = this._effects.length; i < n; i++)
            this._effects[i].render(this._context);
        this._compositeShaderData.addDefine(PostProcess.SHADERDEFINE_FINALPASS);
        //dithering.Render(context);
        var offScreenTex = camera._offScreenRenderTexture;
        var dest = offScreenTex ? offScreenTex : null; //TODO:如果不画到RenderTarget上,最后一次为null直接画到屏幕上
        this._context.destination = dest;
        var canvasWidth = camera._getCanvasWidth(), canvasHeight = camera._getCanvasHeight();
        camera._screenOffsetScale.setValue(viewport.x / canvasWidth, viewport.y / canvasHeight, viewport.width / canvasWidth, viewport.height / canvasHeight);
        this._context.command.blitScreenTriangle(this._context.source, dest, camera._screenOffsetScale, this._compositeShader, this._compositeShaderData);
        //context.source = context.destination;
        //context.destination = finalDestination;
        //释放临时纹理
        RenderTexture.recoverToPool(screenTexture);
        var tempRenderTextures = this._context.deferredReleaseTextures;
        for (i = 0, n = tempRenderTextures.length; i < n; i++)
            RenderTexture.recoverToPool(tempRenderTextures[i]);
        tempRenderTextures.length = 0;
        ILaya.Render.supportWebGLPlusRendering && ShaderData.setRuntimeValueMode(noteValue);
    }
    /**
     * 添加后期处理效果。
     */
    addEffect(effect) {
        this._effects.push(effect);
    }
    /**
     * 移除后期处理效果。
     */
    removeEffect(effect) {
        var index = this._effects.indexOf(effect);
        if (index !== -1)
            this._effects.splice(index, 1);
    }
}
/**@internal */
PostProcess.SHADERVALUE_MAINTEX = Shader3D.propertyNameToID("u_MainTex");
/**@internal */
PostProcess.SHADERVALUE_BLOOMTEX = Shader3D.propertyNameToID("u_BloomTex");
/**@internal */
PostProcess.SHADERVALUE_AUTOEXPOSURETEX = Shader3D.propertyNameToID("u_AutoExposureTex");
/**@internal */
PostProcess.SHADERVALUE_BLOOM_DIRTTEX = Shader3D.propertyNameToID("u_Bloom_DirtTex");
/**@internal */
PostProcess.SHADERVALUE_BLOOMTEX_TEXELSIZE = Shader3D.propertyNameToID("u_BloomTex_TexelSize");
/**@internal */
PostProcess.SHADERVALUE_BLOOM_DIRTTILEOFFSET = Shader3D.propertyNameToID("u_Bloom_DirtTileOffset");
/**@internal */
PostProcess.SHADERVALUE_BLOOM_SETTINGS = Shader3D.propertyNameToID("u_Bloom_Settings");
/**@internal */
PostProcess.SHADERVALUE_BLOOM_COLOR = Shader3D.propertyNameToID("u_Bloom_Color");
