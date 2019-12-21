import { Event } from "../../events/Event";
import { LayaGL } from "../../layagl/LayaGL";
import { Stat } from "../../utils/Stat";
import { FrustumCulling } from "../graphics/FrustumCulling";
import { Matrix4x4 } from "../math/Matrix4x4";
import { Vector3 } from "../math/Vector3";
import { Utils3D } from "../utils/Utils3D";
import { Bounds } from "./Bounds";
import { MeshRenderer } from "./MeshRenderer";
import { Sprite3D } from "./Sprite3D";
import { Transform3D } from "./Transform3D";
import { RenderElement } from "./render/RenderElement";
import { SkinnedMeshSprite3DShaderDeclaration } from "./SkinnedMeshSprite3DShaderDeclaration";
import { Render } from "../../renders/Render";
/**
 * <code>SkinMeshRenderer</code> 类用于蒙皮渲染器。
 */
export class SkinnedMeshRenderer extends MeshRenderer {
    /**
     * 创建一个 <code>SkinnedMeshRender</code> 实例。
     */
    constructor(owner) {
        super(owner);
        /** @internal */
        this._bones = [];
        /** @internal */
        this._skinnedDataLoopMarks = [];
        /**@internal */
        this._localBounds = new Bounds(Vector3._ZERO, Vector3._ZERO);
        /** @internal */
        this._cacheAnimationNode = []; //[兼容性]
    }
    /**
     * 局部边界。
     */
    get localBounds() {
        return this._localBounds;
    }
    set localBounds(value) {
        this._localBounds = value;
    }
    /**
     * 根节点。
     */
    get rootBone() {
        return this._cacheRootBone;
    }
    set rootBone(value) {
        if (this._cacheRootBone != value) {
            if (this._cacheRootBone)
                this._cacheRootBone.transform.off(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange);
            else
                this._owner.transform.off(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange);
            if (value)
                value.transform.on(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange);
            else
                this._owner.transform.on(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange);
            this._cacheRootBone = value;
            this._onWorldMatNeedChange(Transform3D.TRANSFORM_WORLDPOSITION | Transform3D.TRANSFORM_WORLDQUATERNION | Transform3D.TRANSFORM_WORLDSCALE);
        }
    }
    /**
     * 用于蒙皮的骨骼。
     */
    get bones() {
        return this._bones;
    }
    /**
     * @internal
     */
    _computeSkinnedData() {
        if (this._cacheMesh && this._cacheAvatar /*兼容*/ || this._cacheMesh && !this._cacheAvatar) {
            var bindPoses = this._cacheMesh._inverseBindPoses;
            var pathMarks = this._cacheMesh._skinnedMatrixCaches;
            for (var i = 0, n = this._cacheMesh.subMeshCount; i < n; i++) {
                var subMeshBoneIndices = this._cacheMesh.getSubMesh(i)._boneIndicesList;
                var subData = this._skinnedData[i];
                for (var j = 0, m = subMeshBoneIndices.length; j < m; j++) {
                    var boneIndices = subMeshBoneIndices[j];
                    this._computeSubSkinnedData(bindPoses, boneIndices, subData[j], pathMarks);
                }
            }
        }
    }
    /**
     * @internal
     */
    _computeSubSkinnedData(bindPoses, boneIndices, data, matrixCaches) {
        for (var k = 0, q = boneIndices.length; k < q; k++) {
            var index = boneIndices[k];
            if (this._skinnedDataLoopMarks[index] === Stat.loopCount) {
                var c = matrixCaches[index];
                var preData = this._skinnedData[c.subMeshIndex][c.batchIndex];
                var srcIndex = c.batchBoneIndex * 16;
                var dstIndex = k * 16;
                for (var d = 0; d < 16; d++)
                    data[dstIndex + d] = preData[srcIndex + d];
            }
            else {
                if (!this._cacheAvatar) {
                    Utils3D._mulMatrixArray(this._bones[index].transform.worldMatrix.elements, bindPoses[index], data, k * 16);
                }
                else { //[兼容代码]
                    Utils3D._mulMatrixArray(this._cacheAnimationNode[index].transform.getWorldMatrix(), bindPoses[index], data, k * 16);
                }
                this._skinnedDataLoopMarks[index] = Stat.loopCount;
            }
        }
    }
    /**
     * @internal
     * @override
     */
    _onWorldMatNeedChange(flag) {
        this._boundsChange = true;
        if (this._octreeNode) {
            if (this._cacheAvatar) { //兼容性 
                if (this._indexInOctreeMotionList === -1) //_octreeNode表示在八叉树队列中
                    this._octreeNode._octree.addMotionObject(this);
            }
            else {
                flag &= Transform3D.TRANSFORM_WORLDPOSITION | Transform3D.TRANSFORM_WORLDQUATERNION | Transform3D.TRANSFORM_WORLDSCALE; //过滤有用TRANSFORM标记
                if (flag) {
                    if (this._indexInOctreeMotionList === -1) //_octreeNode表示在八叉树队列中
                        this._octreeNode._octree.addMotionObject(this);
                }
            }
        }
    }
    /**
     *@inheritDoc
     *@override
     *@internal
     */
    _createRenderElement() {
        return new RenderElement();
    }
    /**
    *@inheritDoc
    *@override
    *@internal
    */
    _onMeshChange(value) {
        super._onMeshChange(value);
        this._cacheMesh = value;
        var subMeshCount = value.subMeshCount;
        this._skinnedData = [];
        this._skinnedDataLoopMarks.length = value._inverseBindPoses.length;
        for (var i = 0; i < subMeshCount; i++) {
            var subBoneIndices = value.getSubMesh(i)._boneIndicesList;
            var subCount = subBoneIndices.length;
            var subData = this._skinnedData[i] = [];
            for (var j = 0; j < subCount; j++)
                subData[j] = new Float32Array(subBoneIndices[j].length * 16);
        }
        (this._cacheAvatar && value) && (this._getCacheAnimationNodes()); //[兼容性]
    }
    /**
     * @internal
     */
    _setCacheAnimator(animator) {
        this._cacheAnimator = animator;
        this._shaderValues.addDefine(SkinnedMeshSprite3DShaderDeclaration.SHADERDEFINE_BONE);
        this._setRootNode(); //[兼容性API]
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _calculateBoundingBox() {
        if (!this._cacheAvatar) {
            if (this._cacheRootBone)
                this._localBounds._tranform(this._cacheRootBone.transform.worldMatrix, this._bounds);
            else
                this._localBounds._tranform(this._owner.transform.worldMatrix, this._bounds);
        }
        else { //[兼容性API]
            if (this._cacheAnimator && this._rootBone) {
                var worldMat = SkinnedMeshRenderer._tempMatrix4x4;
                Utils3D.matrix4x4MultiplyMFM(this._cacheAnimator.owner.transform.worldMatrix, this._cacheRootAnimationNode.transform.getWorldMatrix(), worldMat);
                this._localBounds._tranform(worldMat, this._bounds);
            }
            else {
                super._calculateBoundingBox();
            }
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
    _renderUpdate(context, transform) {
        if (this._cacheAnimator) {
            this._computeSkinnedData();
            if (!this._cacheAvatar) {
                this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX, Matrix4x4.DEFAULT);
            }
            else { //[兼容性]
                var aniOwnerTrans = this._cacheAnimator.owner._transform;
                this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX, aniOwnerTrans.worldMatrix);
            }
        }
        else {
            this._shaderValues.setMatrix4x4(Sprite3D.WORLDMATRIX, transform.worldMatrix);
        }
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _renderUpdateWithCamera(context, transform) {
        var projectionView = context.projectionViewMatrix;
        if (this._cacheAnimator) {
            if (!this._cacheAvatar) {
                this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX, projectionView);
            }
            else { //[兼容性]
                var aniOwnerTrans = this._cacheAnimator.owner._transform;
                Matrix4x4.multiply(projectionView, aniOwnerTrans.worldMatrix, this._projectionViewWorldMatrix);
                this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX, this._projectionViewWorldMatrix);
            }
        }
        else {
            Matrix4x4.multiply(projectionView, transform.worldMatrix, this._projectionViewWorldMatrix);
            this._shaderValues.setMatrix4x4(Sprite3D.MVPMATRIX, this._projectionViewWorldMatrix);
        }
    }
    /**
     * @inheritDoc
     * @override
     * @internal
     */
    _destroy() {
        super._destroy();
        if (!this._cacheAvatar) {
            if (this._cacheRootBone)
                (!this._cacheRootBone.destroyed) && (this._cacheRootBone.transform.off(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange));
            else
                (this._owner && !this._owner.destroyed) && (this._owner.transform.off(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange));
        }
        else { //[兼容性]
            if (this._cacheRootAnimationNode)
                this._cacheRootAnimationNode.transform.off(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange);
        }
    }
    /**
     * @override
     * 包围盒。
     */
    get bounds() {
        if (this._boundsChange || this._cacheAvatar) { //有this._cacheAvatar模式会导致裁剪后动画不更新。动画不更新包围不更新。包围盒不更新就永远裁掉了
            this._calculateBoundingBox();
            this._boundsChange = false;
        }
        return this._bounds;
    }
    /**
     * @internal
     */
    _setRootBone(name) {
        this._rootBone = name;
        this._setRootNode(); //[兼容性API]
    }
    /**
     * @internal
     */
    _setRootNode() {
        var rootNode;
        if (this._cacheAnimator && this._rootBone && this._cacheAvatar)
            rootNode = this._cacheAnimator._avatarNodeMap[this._rootBone];
        else
            rootNode = null;
        if (this._cacheRootAnimationNode != rootNode) {
            this._onWorldMatNeedChange(Transform3D.TRANSFORM_WORLDPOSITION | Transform3D.TRANSFORM_WORLDQUATERNION | Transform3D.TRANSFORM_WORLDSCALE);
            this._owner.transform.off(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange);
            if (this._cacheRootAnimationNode)
                this._cacheRootAnimationNode.transform.off(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange);
            (rootNode) && (rootNode.transform.on(Event.TRANSFORM_CHANGED, this, this._onWorldMatNeedChange));
            this._cacheRootAnimationNode = rootNode;
        }
    }
    /**
     * @internal
     */
    _getCacheAnimationNodes() {
        var meshBoneNames = this._cacheMesh._boneNames;
        var innerBindPoseCount = this._cacheMesh._inverseBindPoses.length;
        if (!Render.supportWebGLPlusAnimation) {
            this._cacheAnimationNode.length = innerBindPoseCount;
            var nodeMap = this._cacheAnimator._avatarNodeMap;
            for (var i = 0; i < innerBindPoseCount; i++) {
                var node = nodeMap[meshBoneNames[i]];
                this._cacheAnimationNode[i] = node;
            }
        }
        else { //[NATIVE]
            this._cacheAnimationNodeIndices = new Uint16Array(innerBindPoseCount);
            var nodeMapC = this._cacheAnimator._avatarNodeMap;
            for (i = 0; i < innerBindPoseCount; i++) {
                var nodeC = nodeMapC[meshBoneNames[i]];
                this._cacheAnimationNodeIndices[i] = nodeC ? nodeC._worldMatrixIndex : 0;
            }
        }
    }
    /**
     * @internal
     */
    _setCacheAvatar(value) {
        if (this._cacheAvatar !== value) {
            if (this._cacheMesh) {
                this._cacheAvatar = value;
                if (value) {
                    this._shaderValues.addDefine(SkinnedMeshSprite3DShaderDeclaration.SHADERDEFINE_BONE);
                    this._getCacheAnimationNodes();
                }
            }
            else {
                this._cacheAvatar = value;
            }
            this._setRootNode();
        }
    }
    /**
     * @internal [NATIVE]
     */
    _computeSubSkinnedDataNative(worldMatrixs, cacheAnimationNodeIndices, inverseBindPosesBuffer, boneIndices, data) {
        LayaGL.instance.computeSubSkinnedData(worldMatrixs, cacheAnimationNodeIndices, inverseBindPosesBuffer, boneIndices, data);
    }
    /**
     * @internal
     */
    _computeSkinnedDataForNative() {
        if (this._cacheMesh && this._cacheAvatar /*兼容*/ || this._cacheMesh && !this._cacheAvatar) {
            var bindPoses = this._cacheMesh._inverseBindPoses;
            var pathMarks = this._cacheMesh._skinnedMatrixCaches;
            for (var i = 0, n = this._cacheMesh.subMeshCount; i < n; i++) {
                var subMeshBoneIndices = this._cacheMesh.getSubMesh(i)._boneIndicesList;
                var subData = this._skinnedData[i];
                for (var j = 0, m = subMeshBoneIndices.length; j < m; j++) {
                    var boneIndices = subMeshBoneIndices[j];
                    if (this._cacheAvatar && Render.supportWebGLPlusAnimation) //[Native]
                        this._computeSubSkinnedDataNative(this._cacheAnimator._animationNodeWorldMatrixs, this._cacheAnimationNodeIndices, this._cacheMesh._inverseBindPosesBuffer, boneIndices, subData[j]);
                    else
                        this._computeSubSkinnedData(bindPoses, boneIndices, subData[j], pathMarks);
                }
            }
        }
    }
}
/**@internal */
SkinnedMeshRenderer._tempMatrix4x4 = new Matrix4x4();
