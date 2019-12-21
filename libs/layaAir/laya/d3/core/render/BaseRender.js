import { Bounds } from "../Bounds";
import { RenderableSprite3D } from "../RenderableSprite3D";
import { Transform3D } from "../Transform3D";
import { FrustumCulling } from "../../graphics/FrustumCulling";
import { Vector3 } from "../../math/Vector3";
import { ShaderData } from "../../shader/ShaderData";
import { Event } from "../../../events/Event";
import { EventDispatcher } from "../../../events/EventDispatcher";
import { Render } from "../../../renders/Render";
import { MeshRenderStaticBatchManager } from "../../graphics/MeshRenderStaticBatchManager";
/**
 * <code>Render</code> 类用于渲染器的父类，抽象类不允许实例。
 */
export class BaseRender extends EventDispatcher {
    /**
     * @internal
     * 创建一个新的 <code>BaseRender</code> 实例。
     */
    constructor(owner) {
        super();
        /** @internal  [实现IListPool接口]*/
        this._indexInList = -1;
        /** @internal */
        this._indexInCastShadowList = -1;
        /** @internal */
        this._boundsChange = true;
        /** @internal */
        this._castShadow = false;
        this._supportOctree = true;
        /** @internal */
        this._sharedMaterials = [];
        /**@internal */
        this._visible = true; //初始值为默认可见,否则会造成第一帧动画不更新等，TODO:还有个包围盒更新好像浪费了
        /** @internal */
        this._indexInOctreeMotionList = -1;
        /** @internal */
        this._updateMark = -1;
        /** @internal */
        this._updateRenderType = -1;
        /** @internal */
        this._isPartOfStaticBatch = false;
        /** @internal */
        this._staticBatch = null;
        this._id = ++BaseRender._uniqueIDCounter;
        this._indexInCastShadowList = -1;
        this._bounds = new Bounds(Vector3._ZERO, Vector3._ZERO);
        if (Render.supportWebGLPlusCulling) { //[NATIVE]
            var length = FrustumCulling._cullingBufferLength;
            this._cullingBufferIndex = length;
            var cullingBuffer = FrustumCulling._cullingBuffer;
            var resizeLength = length + 7;
            if (resizeLength >= cullingBuffer.length) {
                var temp = cullingBuffer;
                cullingBuffer = FrustumCulling._cullingBuffer = new Float32Array(cullingBuffer.length + 4096);
                cullingBuffer.set(temp, 0);
            }
            cullingBuffer[length] = 2;
            FrustumCulling._cullingBufferLength = resizeLength;
        }
        this._renderElements = [];
        this._owner = owner;
        this._enable = true;
        this._materialsInstance = [];
        this._shaderValues = new ShaderData(null);
        this.lightmapIndex = -1;
        this.receiveShadow = false;
        this.sortingFudge = 0.0;
        (owner) && (this._owner.transform.on(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange)); //如果为合并BaseRender,owner可能为空
    }
    /**
     * 获取唯一标识ID,通常用于识别。
     */
    get id() {
        return this._id;
    }
    /**
     * 光照贴图的索引。
     */
    get lightmapIndex() {
        return this._lightmapIndex;
    }
    set lightmapIndex(value) {
        if (this._lightmapIndex !== value) {
            this._lightmapIndex = value;
            this._applyLightMapParams();
        }
    }
    /**
     * 光照贴图的缩放和偏移。
     */
    get lightmapScaleOffset() {
        return this._lightmapScaleOffset;
    }
    set lightmapScaleOffset(value) {
        this._lightmapScaleOffset = value;
        this._shaderValues.setVector(RenderableSprite3D.LIGHTMAPSCALEOFFSET, value);
        this._shaderValues.addDefine(RenderableSprite3D.SHADERDEFINE_SCALEOFFSETLIGHTINGMAPUV);
    }
    /**
     * 是否可用。
     */
    get enable() {
        return this._enable;
    }
    set enable(value) {
        this._enable = !!value;
    }
    /**
     * 返回第一个实例材质,第一次使用会拷贝实例对象。
     */
    get material() {
        var material = this._sharedMaterials[0];
        if (material && !this._materialsInstance[0]) {
            var insMat = this._getInstanceMaterial(material, 0);
            var renderElement = this._renderElements[0];
            (renderElement) && (renderElement.material = insMat);
        }
        return this._sharedMaterials[0];
    }
    set material(value) {
        this.sharedMaterial = value;
    }
    /**
     * 潜拷贝实例材质列表,第一次使用会拷贝实例对象。
     */
    get materials() {
        for (var i = 0, n = this._sharedMaterials.length; i < n; i++) {
            if (!this._materialsInstance[i]) {
                var insMat = this._getInstanceMaterial(this._sharedMaterials[i], i);
                var renderElement = this._renderElements[i];
                (renderElement) && (renderElement.material = insMat);
            }
        }
        return this._sharedMaterials.slice();
    }
    set materials(value) {
        this.sharedMaterials = value;
    }
    /**
     * 返回第一个材质。
     */
    get sharedMaterial() {
        return this._sharedMaterials[0];
    }
    set sharedMaterial(value) {
        var lastValue = this._sharedMaterials[0];
        if (lastValue !== value) {
            this._sharedMaterials[0] = value;
            this._materialsInstance[0] = false;
            this._changeMaterialReference(lastValue, value);
            var renderElement = this._renderElements[0];
            (renderElement) && (renderElement.material = value);
        }
    }
    /**
     * 浅拷贝材质列表。
     */
    get sharedMaterials() {
        return this._sharedMaterials.slice();
    }
    set sharedMaterials(value) {
        var materialsInstance = this._materialsInstance;
        var sharedMats = this._sharedMaterials;
        for (var i = 0, n = sharedMats.length; i < n; i++) {
            var lastMat = sharedMats[i];
            (lastMat) && (lastMat._removeReference());
        }
        if (value) {
            var count = value.length;
            materialsInstance.length = count;
            sharedMats.length = count;
            for (i = 0; i < count; i++) {
                lastMat = sharedMats[i];
                var mat = value[i];
                if (lastMat !== mat) {
                    materialsInstance[i] = false;
                    var renderElement = this._renderElements[i];
                    (renderElement) && (renderElement.material = mat);
                }
                if (mat) {
                    mat._addReference();
                }
                sharedMats[i] = mat;
            }
        }
        else {
            throw new Error("BaseRender: shadredMaterials value can't be null.");
        }
    }
    /**
     * 包围盒,只读,不允许修改其值。
     */
    get bounds() {
        if (this._boundsChange) {
            this._calculateBoundingBox();
            this._boundsChange = false;
        }
        return this._bounds;
    }
    set receiveShadow(value) {
        if (this._receiveShadow !== value) {
            this._receiveShadow = value;
            if (value)
                this._shaderValues.addDefine(RenderableSprite3D.SHADERDEFINE_RECEIVE_SHADOW);
            else
                this._shaderValues.removeDefine(RenderableSprite3D.SHADERDEFINE_RECEIVE_SHADOW);
        }
    }
    /**
     * 是否接收阴影属性
     */
    get receiveShadow() {
        return this._receiveShadow;
    }
    /**
     * 是否产生阴影。
     */
    get castShadow() {
        return this._castShadow;
    }
    set castShadow(value) {
        this._castShadow = value;
    }
    /**
     * 是否是静态的一部分。
     */
    get isPartOfStaticBatch() {
        return this._isPartOfStaticBatch;
    }
    /**
     *
     */
    _getOctreeNode() {
        return this._octreeNode;
    }
    /**
     *
     */
    _setOctreeNode(value) {
        this._octreeNode = value;
    }
    /**
     *
     */
    _getIndexInMotionList() {
        return this._indexInOctreeMotionList;
    }
    /**
     *
     */
    _setIndexInMotionList(value) {
        this._indexInOctreeMotionList = value;
    }
    /**
     * @internal
     */
    _changeMaterialReference(lastValue, value) {
        (lastValue) && (lastValue._removeReference());
        value._addReference(); //TODO:value可以为空
    }
    /**
     * @internal
     */
    _getInstanceMaterial(material, index) {
        var insMat = material.clone(); //深拷贝
        insMat.name = insMat.name + "(Instance)";
        this._materialsInstance[index] = true;
        this._changeMaterialReference(this._sharedMaterials[index], insMat);
        this._sharedMaterials[index] = insMat;
        return insMat;
    }
    /**
     * @internal
     */
    _applyLightMapParams() {
        if (this._scene && this._lightmapIndex >= 0) {
            var lightMaps = this._scene.getlightmaps();
            if (this._lightmapIndex < lightMaps.length) {
                this._shaderValues.addDefine(RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
                this._shaderValues.setTexture(RenderableSprite3D.LIGHTMAP, lightMaps[this._lightmapIndex]);
            }
            else {
                this._shaderValues.removeDefine(RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
            }
        }
        else {
            this._shaderValues.removeDefine(RenderableSprite3D.SAHDERDEFINE_LIGHTMAP);
        }
    }
    /**
     * @internal
     */
    _onWorldMatNeedChange(flag) {
        this._boundsChange = true;
        if (this._octreeNode) {
            flag &= Transform3D.TRANSFORM_WORLDPOSITION | Transform3D.TRANSFORM_WORLDQUATERNION | Transform3D.TRANSFORM_WORLDSCALE; //过滤有用TRANSFORM标记
            if (flag) {
                if (this._indexInOctreeMotionList === -1) //_octreeNode表示在八叉树队列中
                    this._octreeNode._octree.addMotionObject(this);
            }
        }
    }
    /**
     * @internal
     */
    _calculateBoundingBox() {
        throw ("BaseRender: must override it.");
    }
    /**
     *  [实现ISingletonElement接口]
     */
    _getIndexInList() {
        return this._indexInList;
    }
    /**
     *  [实现ISingletonElement接口]
     */
    _setIndexInList(index) {
        this._indexInList = index;
    }
    /**
     * @internal
     */
    _setBelongScene(scene) {
        if (this._scene !== scene) {
            this._scene = scene;
            this._applyLightMapParams();
        }
    }
    /**
     * @internal
     * @param boundFrustum 如果boundFrustum为空则为摄像机不裁剪模式。
     */
    _needRender(boundFrustum, context) {
        return true;
    }
    /**
     * @internal
     */
    _renderUpdate(context, transform) {
    }
    /**
     * @internal
     */
    _renderUpdateWithCamera(context, transform) {
    }
    /**
     * @internal
     */
    _revertBatchRenderUpdate(context) {
    }
    /**
     * @internal
     */
    _destroy() {
        (this._indexInOctreeMotionList !== -1) && (this._octreeNode._octree.removeMotionObject(this));
        this.offAll();
        var i = 0, n = 0;
        for (i = 0, n = this._renderElements.length; i < n; i++)
            this._renderElements[i].destroy();
        for (i = 0, n = this._sharedMaterials.length; i < n; i++)
            (this._sharedMaterials[i].destroyed) || (this._sharedMaterials[i]._removeReference()); //TODO:材质可能为空
        this._renderElements = null;
        this._owner = null;
        this._sharedMaterials = null;
        this._bounds = null;
        this._lightmapScaleOffset = null;
    }
    /**
     * 标记为非静态,静态合并后可用于取消静态限制。
     */
    markAsUnStatic() {
        if (this._isPartOfStaticBatch) {
            MeshRenderStaticBatchManager.instance._removeRenderSprite(this._owner);
            this._isPartOfStaticBatch = false;
        }
    }
}
/**@internal */
BaseRender._tempBoundBoxCorners = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
/**@internal */
BaseRender._uniqueIDCounter = 0;
