import { Event } from "../../../events/Event";
import { LayaGL } from "../../../layagl/LayaGL";
import { SubMeshInstanceBatch } from "../../graphics/SubMeshInstanceBatch";
import { Utils3D } from "../../utils/Utils3D";
import { RenderElement } from "./RenderElement";
import { ILaya3D } from "../../../../ILaya3D";
/**
 * @internal
 */
export class SubMeshRenderElement extends RenderElement {
    /**
     * 创建一个 <code>SubMeshRenderElement</code> 实例。
     */
    constructor() {
        super();
        this._dynamicWorldPositionNormalNeedUpdate = true;
    }
    /**
     * @internal
     */
    _onWorldMatrixChanged() {
        this._dynamicWorldPositionNormalNeedUpdate = true;
    }
    /**
     * @inheritDoc
     */
    _computeWorldPositionsAndNormals(positionOffset, normalOffset, multiSubMesh, vertexCount) {
        if (this._dynamicWorldPositionNormalNeedUpdate) {
            var subMesh = this._geometry;
            var vertexBuffer = subMesh._vertexBuffer;
            var vertexFloatCount = vertexBuffer.vertexDeclaration.vertexStride / 4;
            var oriVertexes = vertexBuffer.getFloat32Data();
            var worldMat = this._transform.worldMatrix;
            var rotation = this._transform.rotation; //TODO:是否换成矩阵
            var indices = subMesh._indices;
            for (var i = 0; i < vertexCount; i++) {
                var index = multiSubMesh ? indices[i] : i;
                var oriOffset = index * vertexFloatCount;
                var bakeOffset = i * 3;
                Utils3D.transformVector3ArrayToVector3ArrayCoordinate(oriVertexes, oriOffset + positionOffset, worldMat, this._dynamicWorldPositions, bakeOffset);
                (normalOffset !== -1) && (Utils3D.transformVector3ArrayByQuat(oriVertexes, oriOffset + normalOffset, rotation, this._dynamicWorldNormals, bakeOffset));
            }
            this._dynamicWorldPositionNormalNeedUpdate = false;
        }
    }
    /**
     * @inheritDoc
     * @override
     */
    setTransform(transform) {
        if (this._transform !== transform) {
            (this._transform) && (this._transform.off(Event.TRANSFORM_CHANGED, this, this._onWorldMatrixChanged));
            (transform) && (transform.on(Event.TRANSFORM_CHANGED, this, this._onWorldMatrixChanged));
            this._dynamicWorldPositionNormalNeedUpdate = true;
            this._transform = transform;
        }
    }
    /**
     * @inheritDoc
     * @override
     */
    setGeometry(geometry) {
        if (this._geometry !== geometry) {
            var subMesh = geometry;
            var mesh = subMesh._mesh;
            if (mesh) { //TODO:可能是StaticSubMesh
                var multiSubMesh = mesh._subMeshes.length > 1;
                var dynBatVerCount = multiSubMesh ? subMesh._indexCount : mesh._vertexCount;
                if (dynBatVerCount <= ILaya3D.SubMeshDynamicBatch.maxAllowVertexCount) {
                    var length = dynBatVerCount * 3;
                    this._dynamicVertexBatch = true;
                    this._dynamicWorldPositions = new Float32Array(length);
                    this._dynamicWorldNormals = new Float32Array(length);
                    this._dynamicVertexCount = dynBatVerCount;
                    this._dynamicMultiSubMesh = multiSubMesh;
                }
                else {
                    this._dynamicVertexBatch = false;
                }
            }
            this._geometry = geometry;
        }
    }
    /**
     * @inheritDoc
     * @override
     */
    addToOpaqueRenderQueue(context, queue) {
        var subMeshStaticBatch = this.staticBatch;
        var queueElements = queue.elements;
        var elements = queueElements.elements;
        if (subMeshStaticBatch) {
            var staManager = ILaya3D.MeshRenderStaticBatchManager.instance;
            var staBatchMarks = staManager.getBatchOpaquaMark(this.render.lightmapIndex + 1, this.render.receiveShadow, this.material.id, subMeshStaticBatch._batchID);
            if (staManager._updateCountMark === staBatchMarks.updateMark) {
                var staBatchIndex = staBatchMarks.indexInList;
                if (staBatchMarks.batched) {
                    elements[staBatchIndex].staticBatchElementList.add(this);
                }
                else {
                    var staOriElement = elements[staBatchIndex];
                    var staOriRender = staOriElement.render;
                    var staBatchElement = staManager._getBatchRenderElementFromPool();
                    staBatchElement.renderType = RenderElement.RENDERTYPE_STATICBATCH;
                    staBatchElement.setGeometry(subMeshStaticBatch);
                    staBatchElement.material = staOriElement.material;
                    var staRootOwner = subMeshStaticBatch.batchOwner;
                    var staBatchTransform = staRootOwner ? staRootOwner._transform : null;
                    staBatchElement.setTransform(staBatchTransform);
                    staBatchElement.render = staOriRender;
                    staBatchElement.renderSubShader = staOriElement.renderSubShader;
                    var staBatchList = staBatchElement.staticBatchElementList;
                    staBatchList.length = 0;
                    staBatchList.add(staOriElement);
                    staBatchList.add(this);
                    elements[staBatchIndex] = staBatchElement;
                    staBatchMarks.batched = true;
                }
            }
            else {
                staBatchMarks.updateMark = staManager._updateCountMark;
                staBatchMarks.indexInList = queueElements.length;
                staBatchMarks.batched = false; //是否已有大于两个的元素可合并
                queueElements.add(this);
            }
        }
        else if (this.renderSubShader._owner._enableInstancing && LayaGL.layaGPUInstance.supportInstance() && this.render.lightmapIndex < 0) { //需要支持Instance渲染才可用,暂不支持光照贴图
            var subMesh = this._geometry;
            var insManager = ILaya3D.MeshRenderDynamicBatchManager.instance;
            var insBatchMarks = insManager.getInstanceBatchOpaquaMark(this.render.receiveShadow, this.material.id, subMesh._id, this._transform._isFrontFaceInvert);
            if (insManager._updateCountMark === insBatchMarks.updateMark) {
                var insBatchIndex = insBatchMarks.indexInList;
                if (insBatchMarks.batched) {
                    var instanceBatchElementList = elements[insBatchIndex].instanceBatchElementList;
                    if (instanceBatchElementList.length === SubMeshInstanceBatch.instance.maxInstanceCount) {
                        insBatchMarks.updateMark = insManager._updateCountMark;
                        insBatchMarks.indexInList = queueElements.length;
                        insBatchMarks.batched = false; //是否已有大于两个的元素可合并
                        queueElements.add(this);
                    }
                    else {
                        instanceBatchElementList.add(this);
                    }
                }
                else {
                    var insOriElement = elements[insBatchIndex];
                    var insOriRender = insOriElement.render;
                    var insBatchElement = insManager._getBatchRenderElementFromPool(); //TODO:是否动态和静态方法可合并
                    insBatchElement.renderType = RenderElement.RENDERTYPE_INSTANCEBATCH;
                    insBatchElement.setGeometry(SubMeshInstanceBatch.instance);
                    insBatchElement.material = insOriElement.material;
                    insBatchElement.setTransform(null);
                    insBatchElement.render = insOriRender;
                    insBatchElement.instanceSubMesh = subMesh;
                    insBatchElement.renderSubShader = insOriElement.renderSubShader;
                    var insBatchList = insBatchElement.instanceBatchElementList;
                    insBatchList.length = 0;
                    insBatchList.add(insOriElement);
                    insBatchList.add(this);
                    elements[insBatchIndex] = insBatchElement;
                    insBatchMarks.batched = true;
                }
            }
            else {
                insBatchMarks.updateMark = insManager._updateCountMark;
                insBatchMarks.indexInList = queueElements.length;
                insBatchMarks.batched = false; //是否已有大于两个的元素可合并
                queueElements.add(this);
            }
        }
        else if (this._dynamicVertexBatch) {
            var verDec = this._geometry._vertexBuffer.vertexDeclaration;
            var dynManager = ILaya3D.MeshRenderDynamicBatchManager.instance;
            var dynBatchMarks = dynManager.getVertexBatchOpaquaMark(this.render.lightmapIndex + 1, this.render.receiveShadow, this.material.id, verDec.id);
            if (dynManager._updateCountMark === dynBatchMarks.updateMark) {
                var dynBatchIndex = dynBatchMarks.indexInList;
                if (dynBatchMarks.batched) {
                    elements[dynBatchIndex].vertexBatchElementList.add(this);
                }
                else {
                    var dynOriElement = elements[dynBatchIndex];
                    var dynOriRender = dynOriElement.render;
                    var dynBatchElement = dynManager._getBatchRenderElementFromPool(); //TODO:是否动态和静态方法可合并
                    dynBatchElement.renderType = RenderElement.RENDERTYPE_VERTEXBATCH;
                    dynBatchElement.setGeometry(ILaya3D.SubMeshDynamicBatch.instance);
                    dynBatchElement.material = dynOriElement.material;
                    dynBatchElement.setTransform(null);
                    dynBatchElement.render = dynOriRender;
                    dynBatchElement.vertexBatchVertexDeclaration = verDec;
                    dynBatchElement.renderSubShader = dynOriElement.renderSubShader;
                    var dynBatchList = dynBatchElement.vertexBatchElementList;
                    dynBatchList.length = 0;
                    dynBatchList.add(dynOriElement);
                    dynBatchList.add(this);
                    elements[dynBatchIndex] = dynBatchElement;
                    dynBatchMarks.batched = true;
                }
            }
            else {
                dynBatchMarks.updateMark = dynManager._updateCountMark;
                dynBatchMarks.indexInList = queueElements.length;
                dynBatchMarks.batched = false; //是否已有大于两个的元素可合并
                queueElements.add(this);
            }
        }
        else {
            queueElements.add(this);
        }
    }
    /**
     * @inheritDoc
     * @override
     */
    addToTransparentRenderQueue(context, queue) {
        var subMeshStaticBatch = this.staticBatch;
        var queueElements = queue.elements;
        var elements = queueElements.elements;
        if (subMeshStaticBatch) {
            var staManager = ILaya3D.MeshRenderStaticBatchManager.instance;
            var staLastElement = queue.lastTransparentRenderElement;
            if (staLastElement) {
                var staLastRender = staLastElement.render;
                if (staLastElement._geometry._getType() !== this._geometry._getType() || staLastElement.staticBatch !== subMeshStaticBatch || staLastElement.material !== this.material || staLastRender.receiveShadow !== this.render.receiveShadow || staLastRender.lightmapIndex !== this.render.lightmapIndex) {
                    queueElements.add(this);
                    queue.lastTransparentBatched = false;
                }
                else {
                    if (queue.lastTransparentBatched) {
                        elements[queueElements.length - 1].staticBatchElementList.add((this));
                    }
                    else {
                        var staBatchElement = staManager._getBatchRenderElementFromPool();
                        staBatchElement.renderType = RenderElement.RENDERTYPE_STATICBATCH;
                        staBatchElement.setGeometry(subMeshStaticBatch);
                        staBatchElement.material = staLastElement.material;
                        var staRootOwner = subMeshStaticBatch.batchOwner;
                        var staBatchTransform = staRootOwner ? staRootOwner._transform : null;
                        staBatchElement.setTransform(staBatchTransform);
                        staBatchElement.render = this.render;
                        staBatchElement.renderSubShader = staLastElement.renderSubShader;
                        var staBatchList = staBatchElement.staticBatchElementList;
                        staBatchList.length = 0;
                        staBatchList.add(staLastElement);
                        staBatchList.add(this);
                        elements[queueElements.length - 1] = staBatchElement;
                    }
                    queue.lastTransparentBatched = true;
                }
            }
            else {
                queueElements.add(this);
                queue.lastTransparentBatched = false;
            }
        }
        else if (this.renderSubShader._owner._enableInstancing && LayaGL.layaGPUInstance.supportInstance() && this.render.lightmapIndex < 0) { //需要支持Instance渲染才可用，暂不支持光照贴图
            var subMesh = this._geometry;
            var insManager = ILaya3D.MeshRenderDynamicBatchManager.instance;
            var insLastElement = queue.lastTransparentRenderElement;
            if (insLastElement) {
                var insLastRender = insLastElement.render;
                if (insLastElement._geometry._getType() !== this._geometry._getType() || insLastElement._geometry !== subMesh || insLastElement.material !== this.material || insLastRender.receiveShadow !== this.render.receiveShadow) {
                    queueElements.add(this);
                    queue.lastTransparentBatched = false;
                }
                else {
                    if (queue.lastTransparentBatched) {
                        var instanceBatchElementList = elements[queueElements.length - 1].instanceBatchElementList;
                        if (instanceBatchElementList.length === SubMeshInstanceBatch.instance.maxInstanceCount) {
                            queueElements.add(this);
                            queue.lastTransparentBatched = false;
                        }
                        else {
                            instanceBatchElementList.add(this);
                            queue.lastTransparentBatched = true;
                        }
                    }
                    else {
                        var insBatchElement = insManager._getBatchRenderElementFromPool();
                        insBatchElement.renderType = RenderElement.RENDERTYPE_INSTANCEBATCH;
                        insBatchElement.setGeometry(SubMeshInstanceBatch.instance);
                        insBatchElement.material = insLastElement.material;
                        insBatchElement.setTransform(null);
                        insBatchElement.render = this.render;
                        insBatchElement.instanceSubMesh = subMesh;
                        insBatchElement.renderSubShader = insLastElement.renderSubShader;
                        var insBatchList = insBatchElement.instanceBatchElementList;
                        insBatchList.length = 0;
                        insBatchList.add(insLastElement);
                        insBatchList.add(this);
                        elements[queueElements.length - 1] = insBatchElement;
                        queue.lastTransparentBatched = true;
                    }
                }
            }
            else {
                queueElements.add(this);
                queue.lastTransparentBatched = false;
            }
        }
        else if (this._dynamicVertexBatch) {
            var verDec = this._geometry._vertexBuffer.vertexDeclaration;
            var dynManager = ILaya3D.MeshRenderDynamicBatchManager.instance;
            var dynLastElement = queue.lastTransparentRenderElement;
            if (dynLastElement) {
                var dynLastRender = dynLastElement.render;
                if (dynLastElement._geometry._getType() !== this._geometry._getType() || dynLastElement._geometry._vertexBuffer._vertexDeclaration !== verDec || dynLastElement.material !== this.material || dynLastRender.receiveShadow !== this.render.receiveShadow || dynLastRender.lightmapIndex !== this.render.lightmapIndex) {
                    queueElements.add(this);
                    queue.lastTransparentBatched = false;
                }
                else {
                    if (queue.lastTransparentBatched) {
                        elements[queueElements.length - 1].vertexBatchElementList.add((this));
                    }
                    else {
                        var dynBatchElement = dynManager._getBatchRenderElementFromPool();
                        dynBatchElement.renderType = RenderElement.RENDERTYPE_VERTEXBATCH;
                        dynBatchElement.setGeometry(ILaya3D.SubMeshDynamicBatch.instance);
                        dynBatchElement.material = dynLastElement.material;
                        dynBatchElement.setTransform(null);
                        dynBatchElement.render = this.render;
                        dynBatchElement.vertexBatchVertexDeclaration = verDec;
                        dynBatchElement.renderSubShader = dynLastElement.renderSubShader;
                        var dynBatchList = dynBatchElement.vertexBatchElementList;
                        dynBatchList.length = 0;
                        dynBatchList.add(dynLastElement);
                        dynBatchList.add(this);
                        elements[queueElements.length - 1] = dynBatchElement;
                    }
                    queue.lastTransparentBatched = true;
                }
            }
            else {
                queueElements.add(this);
                queue.lastTransparentBatched = false;
            }
        }
        else {
            queueElements.add(this);
        }
        queue.lastTransparentRenderElement = this;
    }
    getInvertFront() {
        switch (this.renderType) {
            case RenderElement.RENDERTYPE_NORMAL:
                return this._transform._isFrontFaceInvert;
            case RenderElement.RENDERTYPE_STATICBATCH:
            case RenderElement.RENDERTYPE_VERTEXBATCH:
                return false;
            case RenderElement.RENDERTYPE_INSTANCEBATCH:
                return this.instanceBatchElementList.elements[0]._transform._isFrontFaceInvert;
            default:
                throw "SubMeshRenderElement: unknown renderType";
        }
    }
    /**
     * @inheritDoc
     * @override
     */
    destroy() {
        super.destroy();
        this._dynamicWorldPositions = null;
        this._dynamicWorldNormals = null;
        this.staticBatch = null;
        this.staticBatchElementList = null;
        this.vertexBatchElementList = null;
        this.vertexBatchVertexDeclaration = null;
    }
}
