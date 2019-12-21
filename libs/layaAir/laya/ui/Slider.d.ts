import { UIComponent } from "./UIComponent";
import { Label } from "./Label";
import { Image } from "./Image";
import { Button } from "./Button";
import { Event } from "../events/Event";
import { Point } from "../maths/Point";
import { Handler } from "../utils/Handler";
/**
 * 移动滑块位置时调度。
 * @eventType laya.events.Event
 */
/**
 * 移动滑块位置完成（用户鼠标抬起）后调度。
 * @eventType @eventType laya.events.EventD
 *
 */
/**
 * 使用 <code>Slider</code> 控件，用户可以通过在滑块轨道的终点之间移动滑块来选择值。
 * <p>滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。</p>
 * <p>滑块允许最小值和最大值之间特定间隔内的值。滑块还可以使用数据提示显示其当前值。</p>
 *
 * @see laya.ui.HSlider
 * @see laya.ui.VSlider
 */
export declare class Slider extends UIComponent {
    /** @private 获取对 <code>Slider</code> 组件所包含的 <code>Label</code> 组件的引用。*/
    static label: Label;
    /**
     * 数据变化处理器。
     * <p>默认回调参数为滑块位置属性 <code>value</code>属性值：Number 。</p>
     */
    changeHandler: Handler;
    /**
     * 一个布尔值，指示是否为垂直滚动。如果值为true，则为垂直方向，否则为水平方向。
     * <p>默认值为：true。</p>
     * @default true
     */
    isVertical: boolean;
    /**
     * 一个布尔值，指示是否显示标签。
     * @default true
     */
    showLabel: boolean;
    /**@private */
    protected _allowClickBack: boolean;
    /**@private */
    protected _max: number;
    /**@private */
    protected _min: number;
    /**@private */
    protected _tick: number;
    /**@private */
    protected _value: number;
    /**@private */
    protected _skin: string;
    /**@private */
    protected _bg: Image;
    /**@private */
    protected _progress: Image;
    /**@private */
    protected _bar: Button;
    /**@private */
    protected _tx: number;
    /**@private */
    protected _ty: number;
    /**@private */
    protected _maxMove: number;
    /**@private */
    protected _globalSacle: Point;
    /**
     * 创建一个新的 <code>Slider</code> 类示例。
     * @param skin 皮肤。
     */
    constructor(skin?: string);
    /**
     *@inheritDoc
     @override
     */
    destroy(destroyChild?: boolean): void;
    /**
     * @inheritDoc
     * @override
    */
    protected createChildren(): void;
    /**
     * @inheritDoc
     * @override
    */
    protected initialize(): void;
    /**
     * @private
     * 滑块的的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
     */
    protected onBarMouseDown(e: Event): void;
    /**
     * @private
     * 显示标签。
     */
    protected showValueText(): void;
    /**
     * @private
     * 隐藏标签。
     */
    protected hideValueText(): void;
    /**
     * @private
     */
    private mouseUp;
    /**
     * @private
     */
    private mouseMove;
    /**
     * @private
     */
    protected sendChangeEvent(type?: string): void;
    /**
     * @copy laya.ui.Image#skin
     */
    get skin(): string;
    set skin(value: string);
    protected _skinLoaded(): void;
    /**
     * @private
     * 设置滑块的位置信息。
     */
    protected setBarPoint(): void;
    /**@inheritDoc @override*/
    protected measureWidth(): number;
    /**
     * @inheritDoc
     * @override
    */
    protected measureHeight(): number;
    /**
     * @inheritDoc
     * @override
    */
    protected _sizeChanged(): void;
    /**
     * <p>当前实例的背景图（ <code>Image</code> ）和滑块按钮（ <code>Button</code> ）实例的有效缩放网格数据。</p>
     * <p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
     * <ul><li>例如："4,4,4,4,1"</li></ul></p>
     * @see laya.ui.AutoBitmap.sizeGrid
     */
    get sizeGrid(): string;
    set sizeGrid(value: string);
    /**
     * 设置滑动条的信息。
     * @param min 滑块的最小值。
     * @param max 滑块的最小值。
     * @param value 滑块的当前值。
     */
    setSlider(min: number, max: number, value: number): void;
    /**
     * 滑动的刻度值，滑动数值为tick的整数倍。默认值为1。
     */
    get tick(): number;
    set tick(value: number);
    /**
     * @private
     * 改变滑块的位置值。
     */
    changeValue(): void;
    /**
     * 获取或设置表示最高位置的数字。 默认值为100。
     */
    get max(): number;
    set max(value: number);
    /**
     * 获取或设置表示最低位置的数字。 默认值为0。
     */
    get min(): number;
    set min(value: number);
    /**
     * 获取或设置表示当前滑块位置的数字。
     */
    get value(): number;
    set value(num: number);
    /**
     * 一个布尔值，指定是否允许通过点击滑动条改变 <code>Slider</code> 的 <code>value</code> 属性值。
     */
    get allowClickBack(): boolean;
    set allowClickBack(value: boolean);
    /**
     * @private
     * 滑动条的 <code>Event.MOUSE_DOWN</code> 事件侦听处理函数。
     */
    protected onBgMouseDown(e: Event): void;
    /**
     * @inheritDoc
     * @override
    */
    set dataSource(value: any);
    get dataSource(): any;
    /**
     * 表示滑块按钮的引用。
     */
    get bar(): Button;
}
