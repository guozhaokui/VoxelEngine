import { Bounds } from "../Bounds";
import { Material } from "../material/Material";
import { BoundsOctreeNode } from "../scene/BoundsOctreeNode";
import { IOctreeObject } from "../scene/IOctreeObject";
import { Vector4 } from "../../math/Vector4";
import { EventDispatcher } from "../../../events/EventDispatcher";
import { ISingletonElement } from "../../../resource/ISingletonElement";
/**
 * <code>Render</code> 类用于渲染器的父类，抽象类不允许实例。
 */
export declare class BaseRender extends EventDispatcher implements ISingletonElement, IOctreeObject {
    _supportOctree: boolean;
    /**排序矫正值。*/
    sortingFudge: number;
    /**
     * 获取唯一标识ID,通常用于识别。
     */
    get id(): number;
    /**
     * 光照贴图的索引。
     */
    get lightmapIndex(): number;
    set lightmapIndex(value: number);
    /**
     * 光照贴图的缩放和偏移。
     */
    get lightmapScaleOffset(): Vector4;
    set lightmapScaleOffset(value: Vector4);
    /**
     * 是否可用。
     */
    get enable(): boolean;
    set enable(value: boolean);
    /**
     * 返回第一个实例材质,第一次使用会拷贝实例对象。
     */
    get material(): Material;
    set material(value: Material);
    /**
     * 潜拷贝实例材质列表,第一次使用会拷贝实例对象。
     */
    get materials(): Material[];
    set materials(value: Material[]);
    /**
     * 返回第一个材质。
     */
    get sharedMaterial(): Material;
    set sharedMaterial(value: Material);
    /**
     * 浅拷贝材质列表。
     */
    get sharedMaterials(): Material[];
    set sharedMaterials(value: Material[]);
    /**
     * 包围盒,只读,不允许修改其值。
     */
    get bounds(): Bounds;
    set receiveShadow(value: boolean);
    /**
     * 是否接收阴影属性
     */
    get receiveShadow(): boolean;
    /**
     * 是否产生阴影。
     */
    get castShadow(): boolean;
    set castShadow(value: boolean);
    /**
     * 是否是静态的一部分。
     */
    get isPartOfStaticBatch(): boolean;
    /**
     *
     */
    _getOctreeNode(): BoundsOctreeNode;
    /**
     *
     */
    _setOctreeNode(value: BoundsOctreeNode): void;
    /**
     *
     */
    _getIndexInMotionList(): number;
    /**
     *
     */
    _setIndexInMotionList(value: number): void;
    /**
     *  [实现ISingletonElement接口]
     */
    _getIndexInList(): number;
    /**
     *  [实现ISingletonElement接口]
     */
    _setIndexInList(index: number): void;
    /**
     * 标记为非静态,静态合并后可用于取消静态限制。
     */
    markAsUnStatic(): void;
}
