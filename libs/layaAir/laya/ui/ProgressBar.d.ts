import { UIComponent } from "./UIComponent";
import { Image } from "./Image";
import { Handler } from "../utils/Handler";
/**
 * 值发生改变后调度。
 * @eventType laya.events.Event
 */
/**
 * <code>ProgressBar</code> 组件显示内容的加载进度。
 * @example <caption>以下示例代码，创建了一个新的 <code>ProgressBar</code> 实例，设置了它的皮肤、位置、宽高、网格等信息，并添加到舞台上。</caption>
 * package
 *	{
 *		import laya.ui.ProgressBar;
 *		import laya.utils.Handler;
 *		public class ProgressBar_Example
 *		{
 *			private var progressBar:ProgressBar;
 *			public function ProgressBar_Example()
 *			{
 *				Laya.init(640, 800);//设置游戏画布宽高。
 *				Laya.stage.bgColor = "#efefef";//设置画布的背景颜色。
 *				Laya.loader.load(["resource/ui/progress.png", "resource/ui/progress$bar.png"], Handler.create(this, onLoadComplete));//加载资源。
 *			}
 *			private function onLoadComplete():void
 *			{
 *				progressBar = new ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
 *				progressBar.x = 100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
 *				progressBar.y = 100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
 *				progressBar.value = 0.3;//设置 progressBar 的进度值。
 *				progressBar.width = 200;//设置 progressBar 的宽度。
 *				progressBar.height = 50;//设置 progressBar 的高度。
 *				progressBar.sizeGrid = "5,10,5,10";//设置 progressBar 的网格信息。
 *				progressBar.changeHandler = new Handler(this, onChange);//设置 progressBar 的value值改变时执行的处理器。
 *				Laya.stage.addChild(progressBar);//将 progressBar 添加到显示列表。
 *				Laya.timer.once(3000, this, changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
 *			}
 *			private function changeValue():void
 *			{
 *				trace("改变进度条的进度值。");
 *				progressBar.value = 0.6;
 *			}
 *			private function onChange(value:Number):void
 *			{
 *				trace("进度发生改变： value=" ,value);
 *			}
 *		}
 *	}
 * @example
 * Laya.init(640, 800);//设置游戏画布宽高
 * Laya.stage.bgColor = "#efefef";//设置画布的背景颜色
 * var res = ["resource/ui/progress.png", "resource/ui/progress$bar.png"];
 * Laya.loader.load(res, laya.utils.Handler.create(this, onLoadComplete));//加载资源。
 * function onLoadComplete()
 * {
 *     progressBar = new laya.ui.ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
 *     progressBar.x = 100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
 *     progressBar.y = 100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
 *     progressBar.value = 0.3;//设置 progressBar 的进度值。
 *     progressBar.width = 200;//设置 progressBar 的宽度。
 *     progressBar.height = 50;//设置 progressBar 的高度。
 *     progressBar.sizeGrid = "10,5,10,5";//设置 progressBar 的网格信息。
 *     progressBar.changeHandler = new laya.utils.Handler(this, onChange);//设置 progressBar 的value值改变时执行的处理器。
 *     Laya.stage.addChild(progressBar);//将 progressBar 添加到显示列表。
 *     Laya.timer.once(3000, this, changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
 * }
 * function changeValue()
 * {
 *     console.log("改变进度条的进度值。");
 *     progressBar.value = 0.6;
 * }
 * function onChange(value)
 * {
 *     console.log("进度发生改变： value=" ,value);
 * }
 * @example
 * import ProgressBar = laya.ui.ProgressBar;
 * import Handler = laya.utils.Handler;
 * class ProgressBar_Example {
 *     private progressBar: ProgressBar;
 *     public ProgressBar_Example() {
 *         Laya.init(640, 800);//设置游戏画布宽高。
 *         Laya.stage.bgColor = "#efefef";//设置画布的背景颜色。
 *         Laya.loader.load(["resource/ui/progress.png", "resource/ui/progress$bar.png"], Handler.create(this, this.onLoadComplete));//加载资源。
 *     }
 *     private onLoadComplete(): void {
 *         this.progressBar = new ProgressBar("resource/ui/progress.png");//创建一个 ProgressBar 类的实例对象 progressBar 。
 *         this.progressBar.x = 100;//设置 progressBar 对象的属性 x 的值，用于控制 progressBar 对象的显示位置。
 *         this.progressBar.y = 100;//设置 progressBar 对象的属性 y 的值，用于控制 progressBar 对象的显示位置。
 *         this.progressBar.value = 0.3;//设置 progressBar 的进度值。
 *         this.progressBar.width = 200;//设置 progressBar 的宽度。
 *         this.progressBar.height = 50;//设置 progressBar 的高度。
 *         this.progressBar.sizeGrid = "5,10,5,10";//设置 progressBar 的网格信息。
 *         this.progressBar.changeHandler = new Handler(this, this.onChange);//设置 progressBar 的value值改变时执行的处理器。
 *         Laya.stage.addChild(this.progressBar);//将 progressBar 添加到显示列表。
 *         Laya.timer.once(3000, this, this.changeValue);//设定 3000ms（毫秒）后，执行函数changeValue。
 *     }
 *     private changeValue(): void {
 *         console.log("改变进度条的进度值。");
 *         this.progressBar.value = 0.6;
 *     }
 *     private onChange(value: number): void {
 *         console.log("进度发生改变： value=", value);
 *     }
 * }
 */
export declare class ProgressBar extends UIComponent {
    /**
     * 当 <code>ProgressBar</code> 实例的 <code>value</code> 属性发生变化时的函数处理器。
     * <p>默认返回参数<code>value</code> 属性（进度值）。</p>
     */
    changeHandler: Handler;
    /**@private */
    protected _bg: Image;
    /**@private */
    protected _bar: Image;
    /**@private */
    protected _skin: string;
    /**@private */
    protected _value: number;
    /**
     * 创建一个新的 <code>ProgressBar</code> 类实例。
     * @param skin 皮肤地址。
     */
    constructor(skin?: string);
    /**
     * @inheritDoc
     * @override
    */
    destroy(destroyChild?: boolean): void;
    /**
     * @inheritDoc
     * @override
    */
    protected createChildren(): void;
    /**
     * @copy laya.ui.Image#skin
     */
    get skin(): string;
    set skin(value: string);
    protected _skinLoaded(): void;
    /**
     * @inheritDoc
     * @override
    */
    protected measureWidth(): number;
    /**
     * @inheritDoc
     * @override
    */
    protected measureHeight(): number;
    /**
     * 当前的进度量。
     * <p><b>取值：</b>介于0和1之间。</p>
     */
    get value(): number;
    set value(num: number);
    /**
     * @private
     * 更改进度值的显示。
     */
    protected changeValue(): void;
    /**
     * 获取进度条对象。
     */
    get bar(): Image;
    /**
     * 获取背景条对象。
     */
    get bg(): Image;
    /**
     * <p>当前 <code>ProgressBar</code> 实例的进度条背景位图（ <code>Image</code> 实例）的有效缩放网格数据。</p>
     * <p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
     * <ul><li>例如："4,4,4,4,1"</li></ul></p>
     * @see laya.ui.AutoBitmap.sizeGrid
     */
    get sizeGrid(): string;
    set sizeGrid(value: string);
    /**
     * @inheritDoc
     * @override
    */
    set width(value: number);
    get width(): number;
    /**
     * @inheritDoc
     * @override
    */
    set height(value: number);
    get height(): number;
    /**
     * @inheritDoc
     * @override
    */
    set dataSource(value: any);
    get dataSource(): any;
}
