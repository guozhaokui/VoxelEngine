import { Laya } from "../../../Laya";
import { Event } from "../../events/Event";
import { Loader } from "../../net/Loader";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { Vector4 } from "../math/Vector4";
import { SkyRenderer } from "../resource/models/SkyRenderer";
import { Shader3D } from "../shader/Shader3D";
import { ShaderData } from "../shader/ShaderData";
import { Sprite3D } from "./Sprite3D";
/**
 * <code>BaseCamera</code> 类用于创建摄像机的父类。
 */
export class BaseCamera extends Sprite3D {
    /**
     * 创建一个 <code>BaseCamera</code> 实例。
     * @param	fieldOfView 视野。
     * @param	nearPlane 近裁面。
     * @param	farPlane 远裁面。
     */
    constructor(nearPlane = 0.3, farPlane = 1000) {
        super();
        this._skyRenderer = new SkyRenderer();
        this._forward = new Vector3();
        this._up = new Vector3();
        /**摄像机的清除颜色,默认颜色为CornflowerBlue。*/
        this.clearColor = new Vector4(100 / 255, 149 / 255, 237 / 255, 255 / 255);
        this._shaderValues = new ShaderData(null);
        this._fieldOfView = 60;
        this._useUserProjectionMatrix = false;
        this._orthographic = false;
        this._orthographicVerticalSize = 10;
        this.renderingOrder = 0;
        this._nearPlane = nearPlane;
        this._farPlane = farPlane;
        this.cullingMask = 2147483647 /*int.MAX_VALUE*/;
        this.useOcclusionCulling = true;
    }
    /**
     * 天空渲染器。
     */
    get skyRenderer() {
        return this._skyRenderer;
    }
    /**
     * 视野。
     */
    get fieldOfView() {
        return this._fieldOfView;
    }
    set fieldOfView(value) {
        this._fieldOfView = value;
        this._calculateProjectionMatrix();
    }
    /**
     * 近裁面。
     */
    get nearPlane() {
        return this._nearPlane;
    }
    set nearPlane(value) {
        this._nearPlane = value;
        this._calculateProjectionMatrix();
    }
    /**
     * 远裁面。
     */
    get farPlane() {
        return this._farPlane;
    }
    set farPlane(vaule) {
        this._farPlane = vaule;
        this._calculateProjectionMatrix();
    }
    /**
     * 是否正交投影矩阵。
     */
    get orthographic() {
        return this._orthographic;
    }
    set orthographic(vaule) {
        this._orthographic = vaule;
        this._calculateProjectionMatrix();
    }
    /**
     * 正交投影垂直矩阵尺寸。
     */
    get orthographicVerticalSize() {
        return this._orthographicVerticalSize;
    }
    set orthographicVerticalSize(vaule) {
        this._orthographicVerticalSize = vaule;
        this._calculateProjectionMatrix();
    }
    get renderingOrder() {
        return this._renderingOrder;
    }
    set renderingOrder(value) {
        this._renderingOrder = value;
        this._sortCamerasByRenderingOrder();
    }
    /**
     * 通过RenderingOrder属性对摄像机机型排序。
     */
    _sortCamerasByRenderingOrder() {
        if (this.displayedInStage) {
            var cameraPool = this.scene._cameraPool; //TODO:可优化，从队列中移除再加入
            var n = cameraPool.length - 1;
            for (var i = 0; i < n; i++) {
                if (cameraPool[i].renderingOrder > cameraPool[n].renderingOrder) {
                    var tempCamera = cameraPool[i];
                    cameraPool[i] = cameraPool[n];
                    cameraPool[n] = tempCamera;
                }
            }
        }
    }
    /**
     * @internal
     */
    _calculateProjectionMatrix() {
    }
    /**
     * @internal
     */
    _onScreenSizeChanged() {
        this._calculateProjectionMatrix();
    }
    /**
     * @internal
     */
    _prepareCameraToRender() {
        var cameraSV = this._shaderValues;
        this.transform.getForward(this._forward);
        this.transform.getUp(this._up);
        cameraSV.setVector3(BaseCamera.CAMERAPOS, this.transform.position);
        cameraSV.setVector3(BaseCamera.CAMERADIRECTION, this._forward);
        cameraSV.setVector3(BaseCamera.CAMERAUP, this._up);
    }
    /**
     * 相机渲染。
     * @param	shader 着色器。
     * @param   replacementTag 着色器替换标记。
     */
    render(shader = null, replacementTag = null) {
    }
    /**
     * 增加可视图层,layer值为0到31层。
     * @param layer 图层。
     */
    addLayer(layer) {
        this.cullingMask |= Math.pow(2, layer);
    }
    /**
     * 移除可视图层,layer值为0到31层。
     * @param layer 图层。
     */
    removeLayer(layer) {
        this.cullingMask &= ~Math.pow(2, layer);
    }
    /**
     * 增加所有图层。
     */
    addAllLayers() {
        this.cullingMask = 2147483647 /*int.MAX_VALUE*/;
    }
    /**
     * 移除所有图层。
     */
    removeAllLayers() {
        this.cullingMask = 0;
    }
    resetProjectionMatrix() {
        this._useUserProjectionMatrix = false;
        this._calculateProjectionMatrix();
    }
    //public void BoundingFrustumViewSpace(Vector3[] cornersViewSpace)
    //{
    //if (cornersViewSpace.Length != 4)
    //throw new ArgumentOutOfRangeException("cornersViewSpace");
    //boundingFrustum.Matrix = ViewMatrix * ProjectionMatrix;
    //boundingFrustum.GetCorners(cornersWorldSpace);
    //// Transform form world space to view space
    //for (int i = 0; i < 4; i++)
    //{
    //cornersViewSpace[i] = Vector3.Transform(cornersWorldSpace[i + 4], ViewMatrix);
    //}
    //
    //// Swap the last 2 values.
    //Vector3 temp = cornersViewSpace[3];
    //cornersViewSpace[3] = cornersViewSpace[2];
    //cornersViewSpace[2] = temp;
    //} // BoundingFrustumViewSpace
    //public void BoundingFrustumWorldSpace(Vector3[] cornersWorldSpaceResult)
    //{
    //if (cornersWorldSpaceResult.Length != 4)
    //throw new ArgumentOutOfRangeException("cornersViewSpace");
    //boundingFrustum.Matrix = ViewMatrix * ProjectionMatrix;
    //boundingFrustum.GetCorners(cornersWorldSpace);
    //// Transform form world space to view space
    //for (int i = 0; i < 4; i++)
    //{
    //cornersWorldSpaceResult[i] = cornersWorldSpace[i + 4];
    //}
    //
    //// Swap the last 2 values.
    //Vector3 temp = cornersWorldSpaceResult[3];
    //cornersWorldSpaceResult[3] = cornersWorldSpaceResult[2];
    //cornersWorldSpaceResult[2] = temp;
    //} // BoundingFrustumWorldSpace
    /**
     * @inheritDoc
     * @override
     */
    _onActive() {
        this._scene._addCamera(this);
        super._onActive();
    }
    /**
     * @inheritDoc
     * @override
     */
    _onInActive() {
        this._scene._removeCamera(this);
        super._onInActive();
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _parse(data, spriteMap) {
        super._parse(data, spriteMap);
        this.orthographic = data.orthographic;
        (data.orthographicVerticalSize !== undefined) && (this.orthographicVerticalSize = data.orthographicVerticalSize);
        (data.fieldOfView !== undefined) && (this.fieldOfView = data.fieldOfView);
        this.nearPlane = data.nearPlane;
        this.farPlane = data.farPlane;
        var color = data.clearColor;
        this.clearColor = new Vector4(color[0], color[1], color[2], color[3]);
        var skyboxMaterial = data.skyboxMaterial;
        if (skyboxMaterial) {
            this._skyRenderer.material = Loader.getRes(skyboxMaterial.path);
        }
    }
    /**
     * @inheritDoc
     * @override
     */
    destroy(destroyChild = true) {
        //postProcess = null;
        //AmbientLight = null;
        this._skyRenderer.destroy();
        this._skyRenderer = null;
        Laya.stage.off(Event.RESIZE, this, this._onScreenSizeChanged);
        super.destroy(destroyChild);
    }
    /**
     * @internal
     */
    _create() {
        return new BaseCamera();
    }
}
BaseCamera._tempMatrix4x40 = new Matrix4x4();
BaseCamera.CAMERAPOS = Shader3D.propertyNameToID("u_CameraPos");
BaseCamera.VIEWMATRIX = Shader3D.propertyNameToID("u_View");
BaseCamera.PROJECTMATRIX = Shader3D.propertyNameToID("u_Projection");
BaseCamera.VIEWPROJECTMATRIX = Shader3D.propertyNameToID("u_ViewProjection");
BaseCamera.CAMERADIRECTION = Shader3D.propertyNameToID("u_CameraDirection");
BaseCamera.CAMERAUP = Shader3D.propertyNameToID("u_CameraUp");
BaseCamera.VIEWPORT = Shader3D.propertyNameToID("u_Viewport");
BaseCamera.PROJECTION_PARAMS = Shader3D.propertyNameToID("u_ProjectionParams");
/**渲染模式,延迟光照渲染，暂未开放。*/
BaseCamera.RENDERINGTYPE_DEFERREDLIGHTING = "DEFERREDLIGHTING";
/**渲染模式,前向渲染。*/
BaseCamera.RENDERINGTYPE_FORWARDRENDERING = "FORWARDRENDERING";
BaseCamera._invertYScaleMatrix = new Matrix4x4(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); //Matrix4x4.createScaling(new Vector3(1, -1, 1), _invertYScaleMatrix);
BaseCamera._invertYProjectionMatrix = new Matrix4x4();
BaseCamera._invertYProjectionViewMatrix = new Matrix4x4();
/** @deprecated plaease use CameraClearFlags.SolidColor instead.*/
BaseCamera.CLEARFLAG_SOLIDCOLOR = 0;
/** @deprecated plaease use CameraClearFlags.Sky instead.*/
BaseCamera.CLEARFLAG_SKY = 1;
/** @deprecated plaease use CameraClearFlags.DepthOnly instead.*/
BaseCamera.CLEARFLAG_DEPTHONLY = 2;
/** @deprecated plaease use CameraClearFlags.Nothing instead.*/
BaseCamera.CLEARFLAG_NONE = 3;
