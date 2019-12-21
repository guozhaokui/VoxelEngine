import { Vector4 } from "../../math/Vector4";
import { Shader3D } from "../../shader/Shader3D";
import { Material } from "../material/Material";
import { RenderState } from "../material/RenderState";
/**
 * <code>TrailMaterial</code> 类用于实现拖尾材质。
 */
export class TrailMaterial extends Material {
    constructor() {
        super();
        this.setShaderName("Trail");
        this._color = new Vector4(1.0, 1.0, 1.0, 1.0);
        this._shaderValues.setVector(TrailMaterial.TINTCOLOR, new Vector4(1.0, 1.0, 1.0, 1.0));
        this.renderMode = TrailMaterial.RENDERMODE_ALPHABLENDED;
    }
    /**
     * @internal
     */
    static __initDefine__() {
        TrailMaterial.SHADERDEFINE_MAINTEXTURE = Shader3D.getDefineByName("MAINTEXTURE");
        TrailMaterial.SHADERDEFINE_TILINGOFFSET = Shader3D.getDefineByName("TILINGOFFSET");
        TrailMaterial.SHADERDEFINE_ADDTIVEFOG = Shader3D.getDefineByName("ADDTIVEFOG");
    }
    /**
     * @internal
     */
    get _TintColorR() {
        return this._color.x;
    }
    /**
     * @internal
     */
    set _TintColorR(value) {
        this._color.x = value;
        this.color = this._color;
    }
    /**
     * @internal
     */
    get _TintColorG() {
        return this._color.y;
    }
    /**
     * @internal
     */
    set _TintColorG(value) {
        this._color.y = value;
        this.color = this._color;
    }
    /**
     * @internal
     */
    get _TintColorB() {
        return this._color.z;
    }
    /**
     * @internal
     */
    set _TintColorB(value) {
        this._color.z = value;
        this.color = this._color;
    }
    /**@internal */
    get _TintColorA() {
        return this._color.w;
    }
    /**
     * @internal
     */
    set _TintColorA(value) {
        this._color.w = value;
        this.color = this._color;
    }
    /**
     * @internal
     */
    get _MainTex_STX() {
        return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET).x;
    }
    /**
     * @internal
     */
    set _MainTex_STX(x) {
        var tilOff = this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
        tilOff.x = x;
        this.tilingOffset = tilOff;
    }
    /**
     * @internal
     */
    get _MainTex_STY() {
        return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET).y;
    }
    /**
     * @internal
     */
    set _MainTex_STY(y) {
        var tilOff = this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
        tilOff.y = y;
        this.tilingOffset = tilOff;
    }
    /**
     * @internal
     */
    get _MainTex_STZ() {
        return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET).z;
    }
    /**
     * @internal
     */
    set _MainTex_STZ(z) {
        var tilOff = this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
        tilOff.z = z;
        this.tilingOffset = tilOff;
    }
    /**
     * @internal
     */
    get _MainTex_STW() {
        return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET).w;
    }
    /**
     * @internal
     */
    set _MainTex_STW(w) {
        var tilOff = this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
        tilOff.w = w;
        this.tilingOffset = tilOff;
    }
    /**
     * 设置渲染模式。
     * @return 渲染模式。
     */
    set renderMode(value) {
        switch (value) {
            case TrailMaterial.RENDERMODE_ADDTIVE:
                this.renderQueue = Material.RENDERQUEUE_TRANSPARENT;
                this.alphaTest = false;
                this.depthWrite = false;
                this.cull = RenderState.CULL_NONE;
                this.blend = RenderState.BLEND_ENABLE_ALL;
                this.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
                this.blendDst = RenderState.BLENDPARAM_ONE;
                this.depthTest = RenderState.DEPTHTEST_LESS;
                this._shaderValues.addDefine(TrailMaterial.SHADERDEFINE_ADDTIVEFOG);
                break;
            case TrailMaterial.RENDERMODE_ALPHABLENDED:
                this.renderQueue = Material.RENDERQUEUE_TRANSPARENT;
                this.alphaTest = false;
                this.depthWrite = false;
                this.cull = RenderState.CULL_NONE;
                this.blend = RenderState.BLEND_ENABLE_ALL;
                this.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
                this.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
                this.depthTest = RenderState.DEPTHTEST_LESS;
                this._shaderValues.removeDefine(TrailMaterial.SHADERDEFINE_ADDTIVEFOG);
                break;
            default:
                throw new Error("TrailMaterial : renderMode value error.");
        }
    }
    /**
     * 获取颜色R分量。
     * @return 颜色R分量。
     */
    get colorR() {
        return this._TintColorR;
    }
    /**
     * 设置颜色R分量。
     * @param value 颜色R分量。
     */
    set colorR(value) {
        this._TintColorR = value;
    }
    /**
     * 获取颜色G分量。
     * @return 颜色G分量。
     */
    get colorG() {
        return this._TintColorG;
    }
    /**
     * 设置颜色G分量。
     * @param value 颜色G分量。
     */
    set colorG(value) {
        this._TintColorG = value;
    }
    /**
     * 获取颜色B分量。
     * @return 颜色B分量。
     */
    get colorB() {
        return this._TintColorB;
    }
    /**
     * 设置颜色B分量。
     * @param value 颜色B分量。
     */
    set colorB(value) {
        this._TintColorB = value;
    }
    /**
     * 获取颜色Z分量。
     * @return 颜色Z分量。
     */
    get colorA() {
        return this._TintColorA;
    }
    /**
     * 设置颜色alpha分量。
     * @param value 颜色alpha分量。
     */
    set colorA(value) {
        this._TintColorA = value;
    }
    /**
     * 获取颜色。
     * @return 颜色。
     */
    get color() {
        return this._shaderValues.getVector(TrailMaterial.TINTCOLOR);
    }
    /**
     * 设置颜色。
     * @param value 颜色。
     */
    set color(value) {
        this._shaderValues.setVector(TrailMaterial.TINTCOLOR, value);
    }
    /**
     * 获取贴图。
     * @return 贴图。
     */
    get texture() {
        return this._shaderValues.getTexture(TrailMaterial.MAINTEXTURE);
    }
    /**
     * 设置贴图。
     * @param value 贴图。
     */
    set texture(value) {
        if (value)
            this._shaderValues.addDefine(TrailMaterial.SHADERDEFINE_MAINTEXTURE);
        else
            this._shaderValues.removeDefine(TrailMaterial.SHADERDEFINE_MAINTEXTURE);
        this._shaderValues.setTexture(TrailMaterial.MAINTEXTURE, value);
    }
    /**
     * 获取纹理平铺和偏移X分量。
     * @return 纹理平铺和偏移X分量。
     */
    get tilingOffsetX() {
        return this._MainTex_STX;
    }
    /**
     * 获取纹理平铺和偏移X分量。
     * @param x 纹理平铺和偏移X分量。
     */
    set tilingOffsetX(x) {
        this._MainTex_STX = x;
    }
    /**
     * 获取纹理平铺和偏移Y分量。
     * @return 纹理平铺和偏移Y分量。
     */
    get tilingOffsetY() {
        return this._MainTex_STY;
    }
    /**
     * 获取纹理平铺和偏移Y分量。
     * @param y 纹理平铺和偏移Y分量。
     */
    set tilingOffsetY(y) {
        this._MainTex_STY = y;
    }
    /**
     * 获取纹理平铺和偏移Z分量。
     * @return 纹理平铺和偏移Z分量。
     */
    get tilingOffsetZ() {
        return this._MainTex_STZ;
    }
    /**
     * 获取纹理平铺和偏移Z分量。
     * @param z 纹理平铺和偏移Z分量。
     */
    set tilingOffsetZ(z) {
        this._MainTex_STZ = z;
    }
    /**
     * 获取纹理平铺和偏移W分量。
     * @return 纹理平铺和偏移W分量。
     */
    get tilingOffsetW() {
        return this._MainTex_STW;
    }
    /**
     * 获取纹理平铺和偏移W分量。
     * @param w 纹理平铺和偏移W分量。
     */
    set tilingOffsetW(w) {
        this._MainTex_STW = w;
    }
    /**
     * 获取纹理平铺和偏移。
     * @return 纹理平铺和偏移。
     */
    get tilingOffset() {
        return this._shaderValues.getVector(TrailMaterial.TILINGOFFSET);
    }
    /**
     * 设置纹理平铺和偏移。
     * @param value 纹理平铺和偏移。
     */
    set tilingOffset(value) {
        if (value) {
            if (value.x != 1 || value.y != 1 || value.z != 0 || value.w != 0)
                this._shaderValues.addDefine(TrailMaterial.SHADERDEFINE_TILINGOFFSET);
            else
                this._shaderValues.removeDefine(TrailMaterial.SHADERDEFINE_TILINGOFFSET);
        }
        else {
            this._shaderValues.removeDefine(TrailMaterial.SHADERDEFINE_TILINGOFFSET);
        }
        this._shaderValues.setVector(TrailMaterial.TILINGOFFSET, value);
    }
    /**
     * 设置是否写入深度。
     * @param value 是否写入深度。
     */
    set depthWrite(value) {
        this._shaderValues.setBool(TrailMaterial.DEPTH_WRITE, value);
    }
    /**
     * 获取是否写入深度。
     * @return 是否写入深度。
     */
    get depthWrite() {
        return this._shaderValues.getBool(TrailMaterial.DEPTH_WRITE);
    }
    /**
     * 设置剔除方式。
     * @param value 剔除方式。
     */
    set cull(value) {
        this._shaderValues.setInt(TrailMaterial.CULL, value);
    }
    /**
     * 获取剔除方式。
     * @return 剔除方式。
     */
    get cull() {
        return this._shaderValues.getInt(TrailMaterial.CULL);
    }
    /**
     * 设置混合方式。
     * @param value 混合方式。
     */
    set blend(value) {
        this._shaderValues.setInt(TrailMaterial.BLEND, value);
    }
    /**
     * 获取混合方式。
     * @return 混合方式。
     */
    get blend() {
        return this._shaderValues.getInt(TrailMaterial.BLEND);
    }
    /**
     * 设置混合源。
     * @param value 混合源
     */
    set blendSrc(value) {
        this._shaderValues.setInt(TrailMaterial.BLEND_SRC, value);
    }
    /**
     * 获取混合源。
     * @return 混合源。
     */
    get blendSrc() {
        return this._shaderValues.getInt(TrailMaterial.BLEND_SRC);
    }
    /**
     * 设置混合目标。
     * @param value 混合目标
     */
    set blendDst(value) {
        this._shaderValues.setInt(TrailMaterial.BLEND_DST, value);
    }
    /**
     * 获取混合目标。
     * @return 混合目标。
     */
    get blendDst() {
        return this._shaderValues.getInt(TrailMaterial.BLEND_DST);
    }
    /**
     * 设置深度测试方式。
     * @param value 深度测试方式
     */
    set depthTest(value) {
        this._shaderValues.setInt(TrailMaterial.DEPTH_TEST, value);
    }
    /**
     * 获取深度测试方式。
     * @return 深度测试方式。
     */
    get depthTest() {
        return this._shaderValues.getInt(TrailMaterial.DEPTH_TEST);
    }
    /**
     * @inheritdoc
     * @override
     */
    clone() {
        var dest = new TrailMaterial();
        this.cloneTo(dest);
        return dest;
    }
}
/**渲染状态_透明混合。*/
TrailMaterial.RENDERMODE_ALPHABLENDED = 0;
/**渲染状态_加色法混合。*/
TrailMaterial.RENDERMODE_ADDTIVE = 1;
TrailMaterial.MAINTEXTURE = Shader3D.propertyNameToID("u_MainTexture");
TrailMaterial.TINTCOLOR = Shader3D.propertyNameToID("u_MainColor");
TrailMaterial.TILINGOFFSET = Shader3D.propertyNameToID("u_TilingOffset");
TrailMaterial.CULL = Shader3D.propertyNameToID("s_Cull");
TrailMaterial.BLEND = Shader3D.propertyNameToID("s_Blend");
TrailMaterial.BLEND_SRC = Shader3D.propertyNameToID("s_BlendSrc");
TrailMaterial.BLEND_DST = Shader3D.propertyNameToID("s_BlendDst");
TrailMaterial.DEPTH_TEST = Shader3D.propertyNameToID("s_DepthTest");
TrailMaterial.DEPTH_WRITE = Shader3D.propertyNameToID("s_DepthWrite");
