import { Bitmap } from "./Bitmap";
/**
 * <code>BaseTexture</code> 纹理的父类，抽象类，不允许实例。
 */
export declare class BaseTexture extends Bitmap {
    static WARPMODE_REPEAT: number;
    static WARPMODE_CLAMP: number;
    /**寻址模式_重复。*/
    static FILTERMODE_POINT: number;
    /**寻址模式_不循环。*/
    static FILTERMODE_BILINEAR: number;
    /**寻址模式_不循环。*/
    static FILTERMODE_TRILINEAR: number;
    /**
     * 是否使用mipLevel
     */
    get mipmap(): boolean;
    /**
     * 纹理格式
     */
    get format(): number;
    /**
     * 纹理横向循环模式。
     */
    get wrapModeU(): number;
    set wrapModeU(value: number);
    /**
     * 纹理纵向循环模式。
     */
    get wrapModeV(): number;
    set wrapModeV(value: number);
    /**
     * 缩小过滤器
     */
    get filterMode(): number;
    set filterMode(value: number);
    /**
     * 各向异性等级
     */
    get anisoLevel(): number;
    set anisoLevel(value: number);
    /**
     * 获取mipmap数量。
     */
    get mipmapCount(): number;
    get defaulteTexture(): BaseTexture;
    /**
     * 创建一个 <code>BaseTexture</code> 实例。
     */
    constructor(format: number, mipMap: boolean);
    /**
     * @inheritDoc
     * @override
     */
    protected _disposeResource(): void;
    /**
     * 通过基础数据生成mipMap。
     */
    generateMipmap(): void;
    /** @deprecated use TextureFormat.FORMAT_R8G8B8 instead.*/
    static FORMAT_R8G8B8: number;
    /** @deprecated use TextureFormat.FORMAT_R8G8B8A8 instead.*/
    static FORMAT_R8G8B8A8: number;
    /** @deprecated use TextureFormat.FORMAT_ALPHA8 instead.*/
    static FORMAT_ALPHA8: number;
    /** @deprecated use TextureFormat.FORMAT_DXT1 instead.*/
    static FORMAT_DXT1: number;
    /** @deprecated use TextureFormat.FORMAT_DXT5 instead.*/
    static FORMAT_DXT5: number;
    /** @deprecated use TextureFormat.FORMAT_ETC1RGB instead.*/
    static FORMAT_ETC1RGB: number;
    /** @deprecated use TextureFormat.FORMAT_PVRTCRGB_2BPPV instead.*/
    static FORMAT_PVRTCRGB_2BPPV: number;
    /** @deprecated use TextureFormat.FORMAT_PVRTCRGBA_2BPPV instead.*/
    static FORMAT_PVRTCRGBA_2BPPV: number;
    /** @deprecated use TextureFormat.FORMAT_PVRTCRGB_4BPPV instead.*/
    static FORMAT_PVRTCRGB_4BPPV: number;
    /** @deprecated use TextureFormat.FORMAT_PVRTCRGBA_4BPPV instead.*/
    static FORMAT_PVRTCRGBA_4BPPV: number;
    /** @deprecated use RenderTextureFormat.R16G16B16A16 instead.*/
    static RENDERTEXTURE_FORMAT_RGBA_HALF_FLOAT: number;
    /** @deprecated use TextureFormat.R32G32B32A32 instead.*/
    static FORMAT_R32G32B32A32: number;
    /** @deprecated use RenderTextureDepthFormat.DEPTH_16 instead.*/
    static FORMAT_DEPTH_16: number;
    /** @deprecated use RenderTextureDepthFormat.STENCIL_8 instead.*/
    static FORMAT_STENCIL_8: number;
    /** @deprecated use RenderTextureDepthFormat.DEPTHSTENCIL_16_8 instead.*/
    static FORMAT_DEPTHSTENCIL_16_8: number;
    /** @deprecated use RenderTextureDepthFormat.DEPTHSTENCIL_NONE instead.*/
    static FORMAT_DEPTHSTENCIL_NONE: number;
}
