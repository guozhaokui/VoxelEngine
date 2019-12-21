import { Component } from "../../components/Component";
import { Event } from "../../events/Event";
import { Laya } from "../../../Laya";
/**
 * <code>Script3D</code> 类用于创建脚本的父类,该类为抽象类,不允许实例。
 */
export class Script3D extends Component {
    constructor() {
        super(...arguments);
        /**@internal*/
        this._indexInPool = -1;
    }
    /**
     * @inheritDoc
     * @override
     */
    get isSingleton() {
        return false;
    }
    /**
     * @internal
     */
    _checkProcessTriggers() {
        var prototype = Script3D.prototype;
        if (this.onTriggerEnter !== prototype.onTriggerEnter)
            return true;
        if (this.onTriggerStay !== prototype.onTriggerStay)
            return true;
        if (this.onTriggerExit !== prototype.onTriggerExit)
            return true;
        return false;
    }
    /**
     * @internal
     */
    _checkProcessCollisions() {
        var prototype = Script3D.prototype;
        if (this.onCollisionEnter !== prototype.onCollisionEnter)
            return true;
        if (this.onCollisionStay !== prototype.onCollisionStay)
            return true;
        if (this.onCollisionExit !== prototype.onCollisionExit)
            return true;
        return false;
    }
    /**
     * @inheritDoc
     * @internal
     * @override
     */
    _onAwake() {
        this.onAwake();
        if (this.onStart !== Script3D.prototype.onStart)
            Laya.startTimer.callLater(this, this.onStart);
    }
    /**
     * @inheritDoc
     * @internal
     * @override
     */
    _onEnable() {
        this.owner._scene._addScript(this);
        var proto = Script3D.prototype;
        if (this.onKeyDown !== proto.onKeyDown)
            Laya.stage.on(Event.KEY_DOWN, this, this.onKeyDown);
        if (this.onKeyPress !== proto.onKeyPress)
            Laya.stage.on(Event.KEY_PRESS, this, this.onKeyUp);
        if (this.onKeyUp !== proto.onKeyUp)
            Laya.stage.on(Event.KEY_UP, this, this.onKeyUp);
        this.onEnable();
    }
    /**
     * @inheritDoc
     * @internal
     * @override
     */
    _onDisable() {
        this.owner._scene._removeScript(this);
        this.owner.offAllCaller(this);
        Laya.stage.offAllCaller(this);
        this.onDisable();
    }
    /**
     * @inheritDoc
     * @internal
     * @override
     */
    _onDestroy() {
        var scripts = this.owner._scripts;
        scripts.splice(scripts.indexOf(this), 1);
        var sprite = this.owner;
        sprite._needProcessTriggers = false;
        for (var i = 0, n = scripts.length; i < n; i++) {
            if (scripts[i]._checkProcessTriggers()) {
                sprite._needProcessTriggers = true;
                break;
            }
        }
        sprite._needProcessCollisions = false;
        for (i = 0, n = scripts.length; i < n; i++) {
            if (scripts[i]._checkProcessCollisions()) {
                sprite._needProcessCollisions = true;
                break;
            }
        }
        this.onDestroy();
    }
    /**
     * @inheritDoc
     * @internal
     * @override
     */
    _isScript() {
        return true;
    }
    /**
     * @inheritDoc
     * @internal
     * @override
     */
    _onAdded() {
        var sprite = this.owner;
        var scripts = sprite._scripts;
        scripts || (sprite._scripts = scripts = []);
        scripts.push(this);
        if (!sprite._needProcessCollisions)
            sprite._needProcessCollisions = this._checkProcessCollisions(); //检查是否需要处理物理碰撞
        if (!sprite._needProcessTriggers)
            sprite._needProcessTriggers = this._checkProcessTriggers(); //检查是否需要处理触发器
    }
    /**
     * 创建后只执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onAwake() {
    }
    /**
     * 每次启动后执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onEnable() {
    }
    /**
     * 第一次执行update之前执行，只会执行一次
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onStart() {
    }
    /**
     * 开始触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerEnter(other) {
    }
    /**
     * 持续触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerStay(other) {
    }
    /**
     * 结束触发时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onTriggerExit(other) {
    }
    /**
     * 开始碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionEnter(collision) {
    }
    /**
     * 持续碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionStay(collision) {
    }
    /**
     * 结束碰撞时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onCollisionExit(collision) {
    }
    /**
     * 鼠标按下时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseDown() {
    }
    /**
     * 鼠标拖拽时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseDrag() {
    }
    /**
     * 鼠标点击时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseClick() {
    }
    /**
     * 鼠标弹起时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseUp() {
    }
    /**
     * 鼠标进入时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseEnter() {
    }
    /**
     * 鼠标经过时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseOver() {
    }
    /**
     * 鼠标离开时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onMouseOut() {
    }
    /**
     * 键盘按下时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onKeyDown(e) {
    }
    /**
     * 键盘产生一个字符时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onKeyPress(e) {
    }
    /**
     * 键盘抬起时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onKeyUp(e) {
    }
    /**
     * 每帧更新时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onUpdate() {
    }
    /**
     * 每帧更新时执行，在update之后执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onLateUpdate() {
    }
    /**
     * 渲染之前执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onPreRender() {
    }
    /**
     * 渲染之后执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onPostRender() {
    }
    /**
     * 禁用时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onDisable() {
    }
    /**
     * 销毁时执行
     * 此方法为虚方法，使用时重写覆盖即可
     */
    onDestroy() {
    }
}
