import { Node } from "../display/Node";
import { IDestroy } from "../resource/IDestroy";
import { ISingletonElement } from "../resource/ISingletonElement";
/**
 * <code>Component</code> 类用于创建组件的基类。
 */
export declare class Component implements ISingletonElement, IDestroy {
    /** @private [实现IListPool接口]*/
    private _indexInList;
    /** @private */
    private _awaked;
    /**
     * [只读]获取所属Node节点。
     * @readonly
     */
    owner: Node;
    /**
     * 创建一个新的 <code>Component</code> 实例。
     */
    constructor();
    /**
     * 获取唯一标识ID。
     */
    get id(): number;
    /**
     * 是否启用组件。
     */
    get enabled(): boolean;
    set enabled(value: boolean);
    /**
     * 是否为单实例组件。
     */
    get isSingleton(): boolean;
    /**
     * 是否已经销毁 。
     */
    get destroyed(): boolean;
    /**
     * [实现IListPool接口]
     */
    _getIndexInList(): number;
    /**
     * [实现IListPool接口]
     */
    _setIndexInList(index: number): void;
    /**
     * 重置组件参数到默认值，如果实现了这个函数，则组件会被重置并且自动回收到对象池，方便下次复用
     * 如果没有重置，则不进行回收复用
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onReset(): void;
    /**
     * 销毁组件
     */
    destroy(): void;
}
