import { Component } from "../components/Component";
import { EventDispatcher } from "../events/EventDispatcher";
import { Timer } from "../utils/Timer";
/**
 * 添加到父对象后调度。
 * @eventType Event.ADDED
 */
/**
 * 被父对象移除后调度。
 * @eventType Event.REMOVED
 */
/**
 * 加入节点树时调度。
 * @eventType Event.DISPLAY
 */
/**
 * 从节点树移除时调度。
 * @eventType Event.UNDISPLAY
 */
/**
 *  <code>Node</code> 类是可放在显示列表中的所有对象的基类。该显示列表管理 Laya 运行时中显示的所有对象。使用 Node 类排列显示列表中的显示对象。Node 对象可以有子显示对象。
 */
export declare class Node extends EventDispatcher {
    /**@private */
    protected static ARRAY_EMPTY: any[];
    /**@private */
    private _bits;
    /**节点名称。*/
    name: string;
    /**[只读]是否已经销毁。对象销毁后不能再使用。*/
    destroyed: boolean;
    constructor();
    createGLBuffer(): void;
    /**
     * <p>增加事件侦听器，以使侦听器能够接收事件通知。</p>
     * <p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
     * @param	type		事件的类型。
     * @param	caller		事件侦听函数的执行域。
     * @param	listener	事件侦听函数。
     * @param	args		（可选）事件侦听函数的回调参数。
     * @return 此 EventDispatcher 对象。
     * @override
     */
    on(type: string, caller: any, listener: Function, args?: any[]): EventDispatcher;
    /**
     * <p>增加事件侦听器，以使侦听器能够接收事件通知，此侦听事件响应一次后则自动移除侦听。</p>
     * <p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
     * @param	type		事件的类型。
     * @param	caller		事件侦听函数的执行域。
     * @param	listener	事件侦听函数。
     * @param	args		（可选）事件侦听函数的回调参数。
     * @return 此 EventDispatcher 对象。
     * @override
     */
    once(type: string, caller: any, listener: Function, args?: any[]): EventDispatcher;
    /**
     * <p>销毁此对象。destroy对象默认会把自己从父节点移除，并且清理自身引用关系，等待js自动垃圾回收机制回收。destroy后不能再使用。</p>
     * <p>destroy时会移除自身的事情监听，自身的timer监听，移除子对象及从父节点移除自己。</p>
     * @param destroyChild	（可选）是否同时销毁子节点，若值为true,则销毁子节点，否则不销毁子节点。
     */
    destroy(destroyChild?: boolean): void;
    /**
     * 销毁时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onDestroy(): void;
    /**
     * 销毁所有子对象，不销毁自己本身。
     */
    destroyChildren(): void;
    /**
     * 添加子节点。
     * @param	node 节点对象
     * @return	返回添加的节点
     */
    addChild(node: Node): Node;
    addInputChild(node: Node): Node;
    removeInputChild(node: Node): void;
    /**
     * 批量增加子节点
     * @param	...args 无数子节点。
     */
    addChildren(...args: any[]): void;
    /**
     * 添加子节点到指定的索引位置。
     * @param	node 节点对象。
     * @param	index 索引位置。
     * @return	返回添加的节点。
     */
    addChildAt(node: Node, index: number): Node;
    /**
     * 根据子节点对象，获取子节点的索引位置。
     * @param	node 子节点。
     * @return	子节点所在的索引位置。
     */
    getChildIndex(node: Node): number;
    /**
     * 根据子节点的名字，获取子节点对象。
     * @param	name 子节点的名字。
     * @return	节点对象。
     */
    getChildByName(name: string): Node;
    /**
     * 根据子节点的索引位置，获取子节点对象。
     * @param	index 索引位置
     * @return	子节点
     */
    getChildAt(index: number): Node;
    /**
     * 设置子节点的索引位置。
     * @param	node 子节点。
     * @param	index 新的索引。
     * @return	返回子节点本身。
     */
    setChildIndex(node: Node, index: number): Node;
    /**
     * 子节点发生改变。
     * @private
     * @param	child 子节点。
     */
    protected _childChanged(child?: Node): void;
    /**
     * 删除子节点。
     * @param	node 子节点
     * @return	被删除的节点
     */
    removeChild(node: Node): Node;
    /**
     * 从父容器删除自己，如已经被删除不会抛出异常。
     * @return 当前节点（ Node ）对象。
     */
    removeSelf(): Node;
    /**
     * 根据子节点名字删除对应的子节点对象，如果找不到不会抛出异常。
     * @param	name 对象名字。
     * @return 查找到的节点（ Node ）对象。
     */
    removeChildByName(name: string): Node;
    /**
     * 根据子节点索引位置，删除对应的子节点对象。
     * @param	index 节点索引位置。
     * @return	被删除的节点。
     */
    removeChildAt(index: number): Node;
    /**
     * 删除指定索引区间的所有子对象。
     * @param	beginIndex 开始索引。
     * @param	endIndex 结束索引。
     * @return 当前节点对象。
     */
    removeChildren(beginIndex?: number, endIndex?: number): Node;
    /**
     * 替换子节点。
     * 将传入的新节点对象替换到已有子节点索引位置处。
     * @param	newNode 新节点。
     * @param	oldNode 老节点。
     * @return	返回新节点。
     */
    replaceChild(newNode: Node, oldNode: Node): Node;
    /**
     * 子对象数量。
     */
    get numChildren(): number;
    /**父节点。*/
    get parent(): Node;
    /**@private */
    protected _setParent(value: Node): void;
    /**表示是否在显示列表中显示。*/
    get displayedInStage(): boolean;
    /**@private */
    private _updateDisplayedInstage;
    /**
     * 设置指定节点对象是否可见(是否在渲染列表中)。
     * @private
     * @param	node 节点。
     * @param	display 是否可见。
     */
    private _displayChild;
    /**
     * 当前容器是否包含指定的 <code>Node</code> 节点对象 。
     * @param	node  指定的 <code>Node</code> 节点对象 。
     * @return	一个布尔值表示是否包含指定的 <code>Node</code> 节点对象 。
     */
    contains(node: Node): boolean;
    /**
     * 定时重复执行某函数。功能同Laya.timer.timerLoop()。
     * @param	delay		间隔时间(单位毫秒)。
     * @param	caller		执行域(this)。
     * @param	method		结束时的回调方法。
     * @param	args		（可选）回调参数。
     * @param	coverBefore	（可选）是否覆盖之前的延迟执行，默认为true。
     * @param	jumpFrame 时钟是否跳帧。基于时间的循环回调，单位时间间隔内，如能执行多次回调，出于性能考虑，引擎默认只执行一次，设置jumpFrame=true后，则回调会连续执行多次
     */
    timerLoop(delay: number, caller: any, method: Function, args?: any[], coverBefore?: boolean, jumpFrame?: boolean): void;
    /**
     * 定时执行某函数一次。功能同Laya.timer.timerOnce()。
     * @param	delay		延迟时间(单位毫秒)。
     * @param	caller		执行域(this)。
     * @param	method		结束时的回调方法。
     * @param	args		（可选）回调参数。
     * @param	coverBefore	（可选）是否覆盖之前的延迟执行，默认为true。
     */
    timerOnce(delay: number, caller: any, method: Function, args?: any[], coverBefore?: boolean): void;
    /**
     * 定时重复执行某函数(基于帧率)。功能同Laya.timer.frameLoop()。
     * @param	delay		间隔几帧(单位为帧)。
     * @param	caller		执行域(this)。
     * @param	method		结束时的回调方法。
     * @param	args		（可选）回调参数。
     * @param	coverBefore	（可选）是否覆盖之前的延迟执行，默认为true。
     */
    frameLoop(delay: number, caller: any, method: Function, args?: any[], coverBefore?: boolean): void;
    /**
     * 定时执行一次某函数(基于帧率)。功能同Laya.timer.frameOnce()。
     * @param	delay		延迟几帧(单位为帧)。
     * @param	caller		执行域(this)
     * @param	method		结束时的回调方法
     * @param	args		（可选）回调参数
     * @param	coverBefore	（可选）是否覆盖之前的延迟执行，默认为true
     */
    frameOnce(delay: number, caller: any, method: Function, args?: any[], coverBefore?: boolean): void;
    /**
     * 清理定时器。功能同Laya.timer.clearTimer()。
     * @param	caller 执行域(this)。
     * @param	method 结束时的回调方法。
     */
    clearTimer(caller: any, method: Function): void;
    /**
     * <p>延迟运行指定的函数。</p>
     * <p>在控件被显示在屏幕之前调用，一般用于延迟计算数据。</p>
     * @param method 要执行的函数的名称。例如，functionName。
     * @param args 传递给 <code>method</code> 函数的可选参数列表。
     *
     * @see #runCallLater()
     */
    callLater(method: Function, args?: any[]): void;
    /**
     * <p>如果有需要延迟调用的函数（通过 <code>callLater</code> 函数设置），则立即执行延迟调用函数。</p>
     * @param method 要执行的函数名称。例如，functionName。
     * @see #callLater()
     */
    runCallLater(method: Function): void;
    /** @private */
    private _components;
    /**@private */
    private _activeChangeScripts;
    /**
     * 获得所属场景。
     * @return	场景。
     */
    get scene(): any;
    /**
     * 获取自身是否激活。
     *   @return	自身是否激活。
     */
    get active(): boolean;
    /**
     * 设置是否激活。
     * @param	value 是否激活。
     */
    set active(value: boolean);
    /**
     * 获取在场景中是否激活。
     *   @return	在场景中是否激活。
     */
    get activeInHierarchy(): boolean;
    /**
     * @private
     */
    protected _onActive(): void;
    /**
     * @private
     */
    protected _onInActive(): void;
    /**
     * @private
     */
    protected _onActiveInScene(): void;
    /**
     * @private
     */
    protected _onInActiveInScene(): void;
    /**
     * 组件被激活后执行，此时所有节点和组件均已创建完毕，次方法只执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onAwake(): void;
    /**
     * 组件被启用后执行，比如节点被添加到舞台后
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onEnable(): void;
    /**
     * @private
     */
    private _activeScripts;
    /**
     * @private
     */
    private _processInActive;
    /**
     * @private
     */
    private _inActiveScripts;
    /**
     * 组件被禁用时执行，比如从节点从舞台移除后
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onDisable(): void;
    /**
     * @private
     */
    protected _onAdded(): void;
    /**
     * @private
     */
    protected _onRemoved(): void;
    /**
     * 添加组件实例。
     * @param	component 组建实例。
     * @return	组件。
     */
    addComponentIntance(component: Component): any;
    /**
     * 添加组件。
     * @param	componentType 组件类型。
     * @return	组件。
     */
    addComponent(componentType: typeof Component): any;
    /**
     * 获得组件实例，如果没有则返回为null
     * @param	componentType 组建类型
     * @return	返回组件
     */
    getComponent(componentType: typeof Component): any;
    /**
     * 获得组件实例，如果没有则返回为null
     * @param	componentType 组建类型
     * @return	返回组件数组
     */
    getComponents(componentType: typeof Component): any[];
    /**
     * @private
     * 获取timer
     */
    get timer(): Timer;
}
