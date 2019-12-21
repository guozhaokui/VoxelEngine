import { Node } from "../../display/Node";
import { Handler } from "../../utils/Handler";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { Transform3D } from "./Transform3D";
import { ICreateResource } from "../../resource/ICreateResource";
/**
 * <code>Sprite3D</code> 类用于实现3D精灵。
 */
export declare class Sprite3D extends Node implements ICreateResource {
    /**Hierarchy资源。*/
    static HIERARCHY: string;
    /**
     * 创建精灵的克隆实例。
     * @param	original  原始精灵。
     * @param   parent    父节点。
     * @param   worldPositionStays 是否保持自身世界变换。
     * @param	position  世界位置,worldPositionStays为false时生效。
     * @param	rotation  世界旋转,worldPositionStays为false时生效。
     * @return  克隆实例。
     */
    static instantiate(original: Sprite3D, parent?: Node, worldPositionStays?: boolean, position?: Vector3, rotation?: Quaternion): Sprite3D;
    /**
     * 加载网格模板。
     * @param url 模板地址。
     * @param complete 完成回掉。
     */
    static load(url: string, complete: Handler): void;
    /**
     * 唯一标识ID。
     */
    get id(): number;
    /**
     * 蒙版层。
     */
    get layer(): number;
    set layer(value: number);
    /**
     * 资源的URL地址。
     */
    get url(): string;
    /**
     * 是否为静态。
     */
    get isStatic(): boolean;
    /**
     * 精灵变换。
     */
    get transform(): Transform3D;
    /**
     * 创建一个 <code>Sprite3D</code> 实例。
     * @param name 精灵名称。
     * @param isStatic 是否为静态。
     */
    constructor(name?: string, isStatic?: boolean);
    /**
     *
     */
    _setCreateURL(url: string): void;
    /**
     * @inheritDoc
     * @override
     */
    protected _onAdded(): void;
    /**
     * @inheritDoc
     * @override
     */
    protected _onRemoved(): void;
    /**
     * 克隆。
     * @return	 克隆副本。
     */
    clone(): Node;
    /**
     * @inheritDoc
     * @override
     */
    destroy(destroyChild?: boolean): void;
}
