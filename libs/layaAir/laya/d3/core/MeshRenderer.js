import { Render } from "../../renders/Render";
import { FrustumCulling } from "../graphics/FrustumCulling";
import { MeshRenderStaticBatchManager } from "../graphics/MeshRenderStaticBatchManager";
import { SubMeshInstanceBatch } from "../graphics/SubMeshInstanceBatch";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Utils3D } from "../utils/Utils3D";
import { BlinnPhongMaterial } from "./material/BlinnPhongMaterial";
import { MeshSprite3DShaderDeclaration } from "./MeshSprite3DShaderDeclaration";
import { BaseRender } from "./render/BaseRender";
import { RenderElement } from "./render/RenderElement";
import { SubMeshRenderElement } from "./render/SubMeshRenderElement";
import { RenderableSprite3D } from "./RenderableSprite3D";
import { Sprite3D } from "./Sprite3D";
/**
 * <code>MeshRenderer</code> 类用于网格渲染器。
 */
export class MeshRenderer extends BaseRender {
    /**
     * 创建一个新的 <code>MeshRender</code> 实例。
     */
    constructor(owner) {
        super(owner);
        /** @internal */
        this._revertStaticBatchDefineUV1 = false;
        /** @internal */
        this._revertStaticBatchDefineLightMapUV = false;
        this._projectionViewWorldMatrix = new Matrix4x4();
    }
    /**
     * @internal
     */
    _createRenderElement() {
        return new SubMeshRenderElement();
    }
    /**
     * @internal
     */
    _onMeshChange(mesh) {
        if (mesh) {
            var count = mesh.subMeshCount;
            this._renderElements.length = count;
            for (var i = 0; i < count; i++) {
                var renderElement = this._renderElements[i];
                if (!renderElement) {
                    var material = this.sharedMaterials[i];
                    renderElement = this._renderElements[i] = this._createRenderElement();
                    renderElement.setTransform(this._owner._transform);
                    renderElement.render = this;
                    renderElement.material = material ? material : BlinnPhongMaterial.defaultMaterial; //确保有材质,由默认材质代替。
                }
                renderElement.setGeometry(mesh.getSubMesh(i));
            }
        }
        else {
            this._renderElements.length = 0;
        }
        this._boundsChange = true;
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _calculateBoundingBox() {
        var sharedMesh = this._owner.meshFilter.sharedMesh;
        if (sharedMesh) {
            var worldMat = this._owner.transform.worldMatrix;
            sharedMesh.bounds._tranform(worldMat, this._bounds);
        }
        if (Render.supportWebGLPlusCulling) { //[NATIVE]
            var min = this._bounds.getMin();
            var max = this._bounds.getMax();
            var buffer = FrustumCulling._cullingBuffer;
            buffer[this._cullingBufferIndex + 1] = min.x;
            buffer[this._cullingBufferIndex + 2] = min.y;
            buffer[this._cullingBufferIndex + 3] = min.z;
            buffer[this._cullingBufferIndex + 4] = max.x;
            buffer[this._cullingBufferIndex + 5] = max.y;
            buffer[this._cullingBufferIndex + 6] = max.z;
        }
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _needRender(boundFrustum, context) {
        if (boundFrustum)
            return boundFrustum.intersects(this.bounds._getBoundBox());
        else
            return true;
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _renderUpdate(context, transform) {
        var element = context.renderElement;
        switch (element.renderType) {
            case RenderElement.RENDERTYPE_NORMAL:
                this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX, transform.worldMatrix);
                break;
            case RenderElement.RENDERTYPE_STATICBATCH:
                if (transform)
                    this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX, transform.worldMatrix);
                else
                    this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX, Matrix4x4.DEFAULT);
                if (!this._shaderValues.hasDefine(MeshSprite3DShaderDeclaration.SHADERDEFINE_UV1)) {
                    this._shaderValues.addDefine(MeshSprite3DShaderDeclaration.SHADERDEFINE_UV1);
                    this._revertStaticBatchDefineUV1 = true;
                }
                else {
                    this._revertStaticBatchDefineUV1 = false;
                }
                if (this._shaderValues.hasDefine(RenderableSprite3D.SHADERDEFINE_SCALEOFFSETLIGHTINGMAPUV)) {
                    this._shaderValues.removeDefine(RenderableSprite3D.SHADERDEFINE_SCALEOFFSETLIGHTINGMAPUV);
                    this._revertStaticBatchDefineLightMapUV = true;
                }
                else {
                    this._revertStaticBatchDefineLightMapUV = false;
                }
                break;
            case RenderElement.RENDERTYPE_VERTEXBATCH:
                this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX, Matrix4x4.DEFAULT);
                break;
            case RenderElement.RENDERTYPE_INSTANCEBATCH:
                var worldMatrixData = SubMeshInstanceBatch.instance.instanceWorldMatrixData;
                var insBatches = element.instanceBatchElementList;
                var elements = insBatches.elements;
                var count = insBatches.length;
                for (var i = 0; i < count; i++)
                    worldMatrixData.set(elements[i]._transform.worldMatrix.elements, i * 16);
                SubMeshInstanceBatch.instance.instanceWorldMatrixBuffer.setData(worldMatrixData.buffer, 0, 0, count * 16 * 4);
                this._shaderValues.addDefine(MeshSprite3DShaderDeclaration.SHADERDEFINE_GPU_INSTANCE);
                break;
        }
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _renderUpdateWithCamera(context, transform) {
        var projectionView = context.projectionViewMatrix;
        var element = context.renderElement;
        switch (element.renderType) {
            case RenderElement.RENDERTYPE_NORMAL:
            case RenderElement.RENDERTYPE_STATICBATCH:
            case RenderElement.RENDERTYPE_VERTEXBATCH:
                if (transform) {
                    Matrix4x4.multiply(projectionView, transform.worldMatrix, this._projectionViewWorldMatrix);
                    this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX, this._projectionViewWorldMatrix);
                }
                else {
                    this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX, projectionView);
                }
                break;
            case RenderElement.RENDERTYPE_INSTANCEBATCH:
                var mvpMatrixData = SubMeshInstanceBatch.instance.instanceMVPMatrixData;
                var insBatches = element.instanceBatchElementList;
                var elements = insBatches.elements;
                var count = insBatches.length;
                for (var i = 0; i < count; i++) {
                    var worldMat = elements[i]._transform.worldMatrix;
                    Utils3D.mulMatrixByArray(projectionView.elements, 0, worldMat.elements, 0, mvpMatrixData, i * 16);
                }
                SubMeshInstanceBatch.instance.instanceMVPMatrixBuffer.setData(mvpMatrixData.buffer, 0, 0, count * 16 * 4);
                break;
        }
    }
    /**
     * @internal
     * @override
     */
    _revertBatchRenderUpdate(context) {
        var element = context.renderElement;
        switch (element.renderType) {
            case RenderElement.RENDERTYPE_STATICBATCH:
                if (this._revertStaticBatchDefineUV1)
                    this._shaderValues.removeDefine(MeshSprite3DShaderDeclaration.SHADERDEFINE_UV1);
                if (this._revertStaticBatchDefineLightMapUV)
                    this._shaderValues.addDefine(RenderableSprite3D.SHADERDEFINE_SCALEOFFSETLIGHTINGMAPUV);
                break;
            case RenderElement.RENDERTYPE_INSTANCEBATCH:
                this._shaderValues.removeDefine(MeshSprite3DShaderDeclaration.SHADERDEFINE_GPU_INSTANCE);
                break;
        }
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _destroy() {
        (this._isPartOfStaticBatch) && (MeshRenderStaticBatchManager.instance._removeRenderSprite(this._owner));
        super._destroy();
    }
}
