import { PostProcessEffect } from "./PostProcessEffect";
import { PostProcess } from "../../component/PostProcess";
import { Color } from "../../math/Color";
import { Vector4 } from "../../math/Vector4";
import { RenderTexture } from "../../resource/RenderTexture";
import { Shader3D } from "../../shader/Shader3D";
import { ShaderData } from "../../shader/ShaderData";
import { BaseTexture } from "../../../resource/BaseTexture";
import { Texture2D } from "../../../resource/Texture2D";
import { RenderTextureFormat, RenderTextureDepthFormat } from "../../../resource/RenderTextureFormat";
/**
 * <code>BloomEffect</code> 类用于创建泛光效果。
 */
export class BloomEffect extends PostProcessEffect {
    /**
     * 创建一个 <code>BloomEffect</code> 实例。
     */
    constructor() {
        super();
        /**@internal */
        this._shader = null;
        /**@internal */
        this._shaderData = new ShaderData();
        /**@internal */
        this._linearColor = new Color();
        /**@internal */
        this._bloomTextureTexelSize = new Vector4();
        /**@internal */
        this._shaderThreshold = new Vector4();
        /**@internal */
        this._shaderParams = new Vector4();
        /**@internal */
        this._pyramid = null;
        /**@internal */
        this._intensity = 0.0;
        /**@internal */
        this._threshold = 1.0;
        /**@internal */
        this._softKnee = 0.5;
        /**@internal */
        this._diffusion = 7.0;
        /**@internal */
        this._anamorphicRatio = 0.0;
        /**@internal */
        this._dirtIntensity = 0.0;
        /**@internal */
        this._shaderSetting = new Vector4();
        /**@internal */
        this._dirtTileOffset = new Vector4();
        /**限制泛光像素的数量,该值在伽马空间。*/
        this.clamp = 65472.0;
        /**泛光颜色。*/
        this.color = new Color(1.0, 1.0, 1.0, 1.0);
        /**是否开启快速模式。该模式通过降低质量来提升性能。*/
        this.fastMode = false;
        /**镜头污渍纹路,用于为泛光特效增加污渍灰尘效果*/
        this.dirtTexture = null;
        this._shader = Shader3D.find("PostProcessBloom");
        this._pyramid = new Array(BloomEffect.MAXPYRAMIDSIZE * 2);
    }
    /**
     * 获取泛光过滤器强度,最小值为0。
     * @return 强度。
     */
    get intensity() {
        return this._intensity;
    }
    /**
     * 设置泛光过滤器强度,最小值为0。
     * @param value 强度。
     */
    set intensity(value) {
        this._intensity = Math.max(value, 0.0);
    }
    /**
     * 设置泛光阈值,在该阈值亮度以下的像素会被过滤掉,该值在伽马空间。
     * @return 阈值。
     */
    get threshold() {
        return this._threshold;
    }
    /**
     * 获取泛光阈值,在该阈值亮度以下的像素会被过滤掉,该值在伽马空间。
     * @param value 阈值。
     */
    set threshold(value) {
        this._threshold = Math.max(value, 0.0);
    }
    /**
     * 获取软膝盖过渡强度,在阈值以下进行渐变过渡(0为完全硬过度,1为完全软过度)。
     * @return 软膝盖值。
     */
    get softKnee() {
        return this._softKnee;
    }
    /**
     * 设置软膝盖过渡强度,在阈值以下进行渐变过渡(0为完全硬过度,1为完全软过度)。
     * @param value 软膝盖值。
     */
    set softKnee(value) {
        this._softKnee = Math.min(Math.max(value, 0.0), 1.0);
    }
    /**
     * 获取扩散值,改变泛光的扩散范围,最好使用整数值保证效果,该值会改变内部的迭代次数,范围是1到10。
     * @return 光晕的扩散范围。
     */
    get diffusion() {
        return this._diffusion;
    }
    /**
     * 设置扩散值,改变泛光的扩散范围,最好使用整数值保证效果,该值会改变内部的迭代次数,范围是1到10。
     * @param value 光晕的扩散范围。
     */
    set diffusion(value) {
        this._diffusion = Math.min(Math.max(value, 1), 10);
    }
    /**
     * 获取形变比,通过扭曲泛光产生视觉上形变,负值为垂直扭曲,正值为水平扭曲。
     * @return 形变比。
     */
    get anamorphicRatio() {
        return this._anamorphicRatio;
    }
    /**
     * 设置形变比,通过扭曲泛光产生视觉上形变,负值为垂直扭曲,正值为水平扭曲。
     * @param value 形变比。
     */
    set anamorphicRatio(value) {
        this._anamorphicRatio = Math.min(Math.max(value, -1.0), 1.0);
    }
    /**
     * 获取污渍强度。
     * @return 污渍强度。
     */
    get dirtIntensity() {
        return this._dirtIntensity;
    }
    /**
     * 设置污渍强度。
     * @param value 污渍强度。
     */
    set dirtIntensity(value) {
        this._dirtIntensity = Math.max(value, 0.0);
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    render(context) {
        var cmd = context.command;
        var viewport = context.camera.viewport;
        //应用自动曝光调整纹理
        this._shaderData.setTexture(BloomEffect.SHADERVALUE_AUTOEXPOSURETEX, Texture2D.whiteTexture);
        //获取垂直扭曲和水平扭曲宽高
        var ratio = this._anamorphicRatio;
        var rw = ratio < 0 ? -ratio : 0;
        var rh = ratio > 0 ? ratio : 0;
        //半分辨率模糊,性效比较高
        var tw = Math.floor(viewport.width / (2 - rw));
        var th = Math.floor(viewport.height / (2 - rh));
        //计算迭代次数
        var s = Math.max(tw, th);
        var logs;
        logs = Math.log2(s) + this._diffusion - 10;
        var logsInt = Math.floor(logs);
        var iterations = Math.min(Math.max(logsInt, 1), BloomEffect.MAXPYRAMIDSIZE);
        var sampleScale = 0.5 + logs - logsInt;
        this._shaderData.setNumber(BloomEffect.SHADERVALUE_SAMPLESCALE, sampleScale);
        //预过滤参数
        var lthresh = Color.gammaToLinearSpace(this.threshold);
        var knee = lthresh * this._softKnee + 1e-5;
        this._shaderThreshold.setValue(lthresh, lthresh - knee, knee * 2, 0.25 / knee);
        this._shaderData.setVector(BloomEffect.SHADERVALUE_THRESHOLD, this._shaderThreshold);
        var lclamp = Color.gammaToLinearSpace(this.clamp);
        this._shaderParams.setValue(lclamp, 0, 0, 0);
        this._shaderData.setVector(BloomEffect.SHADERVALUE_PARAMS, this._shaderParams);
        var qualityOffset = this.fastMode ? 1 : 0;
        // Downsample
        var lastDownTexture = context.source;
        for (var i = 0; i < iterations; i++) {
            var downIndex = i * 2;
            var upIndex = downIndex + 1;
            var subShader = i == 0 ? BloomEffect.SUBSHADER_PREFILTER13 + qualityOffset : BloomEffect.SUBSHADER_DOWNSAMPLE13 + qualityOffset;
            var mipDownTexture = RenderTexture.createFromPool(tw, th, RenderTextureFormat.R8G8B8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE, BaseTexture.FILTERMODE_BILINEAR);
            this._pyramid[downIndex] = mipDownTexture;
            if (i !== iterations - 1) {
                var mipUpTexture = RenderTexture.createFromPool(tw, th, RenderTextureFormat.R8G8B8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE, BaseTexture.FILTERMODE_BILINEAR);
                this._pyramid[upIndex] = mipUpTexture;
            }
            cmd.blitScreenTriangle(lastDownTexture, mipDownTexture, null, this._shader, this._shaderData, subShader);
            lastDownTexture = mipDownTexture;
            tw = Math.max(Math.floor(tw / 2), 1);
            th = Math.max(Math.floor(th / 2), 1);
        }
        // Upsample
        var lastUpTexture = this._pyramid[(iterations - 1) * 2]; //down
        for (i = iterations - 2; i >= 0; i--) {
            downIndex = i * 2;
            upIndex = downIndex + 1;
            mipDownTexture = this._pyramid[downIndex];
            mipUpTexture = this._pyramid[upIndex];
            cmd.setShaderDataTexture(this._shaderData, BloomEffect.SHADERVALUE_BLOOMTEX, mipDownTexture); //通过指令延迟设置
            cmd.blitScreenTriangle(lastUpTexture, mipUpTexture, null, this._shader, this._shaderData, BloomEffect.SUBSHADER_UPSAMPLETENT + qualityOffset);
            lastUpTexture = mipUpTexture;
        }
        var linearColor = this._linearColor;
        this.color.toLinear(linearColor);
        var intensity = Math.pow(2, this._intensity / 10.0) - 1.0;
        var shaderSettings = this._shaderSetting;
        this._shaderSetting.setValue(sampleScale, intensity, this._dirtIntensity, iterations);
        //镜头污渍
        //需要保证污渍纹理不变型
        var dirtTexture = this.dirtTexture ? this.dirtTexture : Texture2D.blackTexture;
        var dirtRatio = dirtTexture.width / dirtTexture.height;
        var screenRatio = viewport.width / viewport.height;
        var dirtTileOffset = this._dirtTileOffset;
        if (dirtRatio > screenRatio)
            dirtTileOffset.setValue(screenRatio / dirtRatio, 1.0, (1.0 - dirtTileOffset.x) * 0.5, 0.0);
        else if (dirtRatio < screenRatio)
            dirtTileOffset.setValue(1.0, dirtRatio / screenRatio, 0.0, (1.0 - dirtTileOffset.y) * 0.5);
        //合成Shader属性
        var compositeShaderData = context.compositeShaderData;
        if (this.fastMode)
            compositeShaderData.addDefine(PostProcess.SHADERDEFINE_BLOOM_LOW);
        else
            compositeShaderData.addDefine(PostProcess.SHADERDEFINE_BLOOM);
        this._bloomTextureTexelSize.setValue(1.0 / lastUpTexture.width, 1.0 / lastUpTexture.height, lastUpTexture.width, lastUpTexture.height);
        compositeShaderData.setVector(PostProcess.SHADERVALUE_BLOOM_DIRTTILEOFFSET, dirtTileOffset);
        compositeShaderData.setVector(PostProcess.SHADERVALUE_BLOOM_SETTINGS, shaderSettings);
        compositeShaderData.setVector(PostProcess.SHADERVALUE_BLOOM_COLOR, new Vector4(linearColor.r, linearColor.g, linearColor.b, linearColor.a)); //TODO:需要Color支持
        compositeShaderData.setTexture(PostProcess.SHADERVALUE_BLOOM_DIRTTEX, dirtTexture);
        compositeShaderData.setTexture(PostProcess.SHADERVALUE_BLOOMTEX, lastUpTexture);
        compositeShaderData.setVector(PostProcess.SHADERVALUE_BLOOMTEX_TEXELSIZE, this._bloomTextureTexelSize);
        //释放渲染纹理
        for (i = 0; i < iterations; i++) {
            downIndex = i * 2;
            upIndex = downIndex + 1;
            RenderTexture.recoverToPool(this._pyramid[downIndex]);
            (i !== 0 && i !== iterations - 1) && (RenderTexture.recoverToPool(this._pyramid[upIndex])); //i==0为lastUpTexture,需延迟释放,i==iterations - 1,不存在
        }
        context.deferredReleaseTextures.push(lastUpTexture); //TODO:是否需要改机制
    }
}
/** @internal */
BloomEffect.SHADERVALUE_MAINTEX = Shader3D.propertyNameToID("u_MainTex");
/**@internal */
BloomEffect.SHADERVALUE_AUTOEXPOSURETEX = Shader3D.propertyNameToID("u_AutoExposureTex");
/**@internal */
BloomEffect.SHADERVALUE_SAMPLESCALE = Shader3D.propertyNameToID("u_SampleScale");
/**@internal */
BloomEffect.SHADERVALUE_THRESHOLD = Shader3D.propertyNameToID("u_Threshold");
/**@internal */
BloomEffect.SHADERVALUE_PARAMS = Shader3D.propertyNameToID("u_Params");
/**@internal */
BloomEffect.SHADERVALUE_BLOOMTEX = Shader3D.propertyNameToID("u_BloomTex");
/**@internal */
BloomEffect.SUBSHADER_PREFILTER13 = 0;
/**@internal */
BloomEffect.SUBSHADER_PREFILTER4 = 1;
/**@internal */
BloomEffect.SUBSHADER_DOWNSAMPLE13 = 2;
/**@internal */
BloomEffect.SUBSHADER_DOWNSAMPLE4 = 3;
/**@internal */
BloomEffect.SUBSHADER_UPSAMPLETENT = 4;
/**@internal */
BloomEffect.SUBSHADER_UPSAMPLEBOX = 5;
/**@internal */
BloomEffect.MAXPYRAMIDSIZE = 16; // Just to make sure we handle 64k screens... Future-proof!
