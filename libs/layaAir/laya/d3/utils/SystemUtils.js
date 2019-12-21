import { LayaGL } from "../../layagl/LayaGL";
import { RenderTextureFormat } from "../../resource/RenderTextureFormat";
import { TextureFormat } from "../../resource/TextureFormat";
/**
 * 系统工具。
 */
export class SystemUtils {
    /**
     * 图形设备支持的最大纹理数量。
     */
    static get maxTextureCount() {
        return this._maxTextureCount;
    }
    /**
     * 图形设备支持的最大纹理尺寸。
     */
    static get maxTextureSize() {
        return this._maxTextureSize;
    }
    /**
     * 图形设备着色器的大致能力等级,类似于DirectX的shader model概念。
     */
    static get shaderCapailityLevel() {
        return this._shaderCapailityLevel;
    }
    /**
     * 是否支持纹理格式。
     * @param format 纹理格式。
     * @returns 是否支持。
     */
    static supportTextureFormat(format) {
        switch (format) {
            case TextureFormat.R32G32B32A32:
                if (!LayaGL.layaGPUInstance._isWebGL2 && !LayaGL.layaGPUInstance._oesTextureFloat)
                    return false;
                else
                    return true;
            default:
                return true;
        }
    }
    /**
     * 是否支持渲染纹理格式。
     * @param format 渲染纹理格式。
     * @returns 是否支持。
     */
    static supportRenderTextureFormat(format) {
        switch (format) {
            case RenderTextureFormat.R16G16B16A16:
                if (LayaGL.layaGPUInstance._isWebGL2 || LayaGL.layaGPUInstance._oesTextureHalfFloat && LayaGL.layaGPUInstance._oesTextureHalfFloatLinear)
                    return true;
                else
                    return false;
            default:
                return true;
        }
    }
}
