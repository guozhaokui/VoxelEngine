import { Text } from "../display/Text";
import { UIComponent } from "./UIComponent";
/**
 * 文本内容发生改变后调度。
 * @eventType laya.events.Event
 */
/**
 * <p> <code>Label</code> 类用于创建显示对象以显示文本。</p>
 *
 * @example <caption>以下示例代码，创建了一个 <code>Label</code> 实例。</caption>
 * package
 *	{
 *		import laya.ui.Label;
 *		public class Label_Example
 *		{
 *			public function Label_Example()
 *			{
 *				Laya.init(640, 800);//设置游戏画布宽高、渲染模式。
 *				Laya.stage.bgColor = "#efefef";//设置画布的背景颜色。
 *				onInit();
 *			}
 *			private function onInit():void
 *			{
 *				var label:Label = new Label();//创建一个 Label 类的实例对象 label 。
 *				label.font = "Arial";//设置 label 的字体。
 *				label.bold = true;//设置 label 显示为粗体。
 *				label.leading = 4;//设置 label 的行间距。
 *				label.wordWrap = true;//设置 label 自动换行。
 *				label.padding = "10,10,10,10";//设置 label 的边距。
 *				label.color = "#ff00ff";//设置 label 的颜色。
 *				label.text = "Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
 *				label.x = 100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
 *				label.y = 100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
 *				label.width = 300;//设置 label 的宽度。
 *				label.height = 200;//设置 label 的高度。
 *				Laya.stage.addChild(label);//将 label 添加到显示列表。
 *				var passwordLabel:Label = new Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
 *				passwordLabel.asPassword = true;//设置 passwordLabel 的显示反式为密码显示。
 *				passwordLabel.x = 100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
 *				passwordLabel.y = 350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
 *				passwordLabel.width = 300;//设置 passwordLabel 的宽度。
 *				passwordLabel.color = "#000000";//设置 passwordLabel 的文本颜色。
 *				passwordLabel.bgColor = "#ccffff";//设置 passwordLabel 的背景颜色。
 *				passwordLabel.fontSize = 20;//设置 passwordLabel 的文本字体大小。
 *				Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
 *			}
 *		}
 *	}
 * @example
 * Laya.init(640, 800);//设置游戏画布宽高
 * Laya.stage.bgColor = "#efefef";//设置画布的背景颜色
 * onInit();
 * function onInit(){
 *     var label = new laya.ui.Label();//创建一个 Label 类的实例对象 label 。
 *     label.font = "Arial";//设置 label 的字体。
 *     label.bold = true;//设置 label 显示为粗体。
 *     label.leading = 4;//设置 label 的行间距。
 *     label.wordWrap = true;//设置 label 自动换行。
 *     label.padding = "10,10,10,10";//设置 label 的边距。
 *     label.color = "#ff00ff";//设置 label 的颜色。
 *     label.text = "Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
 *     label.x = 100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
 *     label.y = 100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
 *     label.width = 300;//设置 label 的宽度。
 *     label.height = 200;//设置 label 的高度。
 *     Laya.stage.addChild(label);//将 label 添加到显示列表。
 *     var passwordLabel = new laya.ui.Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
 *     passwordLabel.asPassword = true;//设置 passwordLabel 的显示反式为密码显示。
 *     passwordLabel.x = 100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
 *     passwordLabel.y = 350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
 *     passwordLabel.width = 300;//设置 passwordLabel 的宽度。
 *     passwordLabel.color = "#000000";//设置 passwordLabel 的文本颜色。
 *     passwordLabel.bgColor = "#ccffff";//设置 passwordLabel 的背景颜色。
 *     passwordLabel.fontSize = 20;//设置 passwordLabel 的文本字体大小。
 *     Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
 * }
 * @example
 * import Label = laya.ui.Label;
 * class Label_Example {
 *     constructor() {
 *         Laya.init(640, 800);//设置游戏画布宽高。
 *         Laya.stage.bgColor = "#efefef";//设置画布的背景颜色。
 *         this.onInit();
 *     }
 *     private onInit(): void {
 *         var label: Label = new Label();//创建一个 Label 类的实例对象 label 。
 *         label.font = "Arial";//设置 label 的字体。
 *         label.bold = true;//设置 label 显示为粗体。
 *         label.leading = 4;//设置 label 的行间距。
 *         label.wordWrap = true;//设置 label 自动换行。
 *         label.padding = "10,10,10,10";//设置 label 的边距。
 *         label.color = "#ff00ff";//设置 label 的颜色。
 *         label.text = "Hello everyone,我是一个可爱的文本！";//设置 label 的文本内容。
 *         label.x = 100;//设置 label 对象的属性 x 的值，用于控制 label 对象的显示位置。
 *         label.y = 100;//设置 label 对象的属性 y 的值，用于控制 label 对象的显示位置。
 *         label.width = 300;//设置 label 的宽度。
 *         label.height = 200;//设置 label 的高度。
 *         Laya.stage.addChild(label);//将 label 添加到显示列表。
 *         var passwordLabel: Label = new Label("请原谅我，我不想被人看到我心里话。");//创建一个 Label 类的实例对象 passwordLabel 。
 *         passwordLabel.asPassword = true;//设置 passwordLabel 的显示反式为密码显示。
 *         passwordLabel.x = 100;//设置 passwordLabel 对象的属性 x 的值，用于控制 passwordLabel 对象的显示位置。
 *         passwordLabel.y = 350;//设置 passwordLabel 对象的属性 y 的值，用于控制 passwordLabel 对象的显示位置。
 *         passwordLabel.width = 300;//设置 passwordLabel 的宽度。
 *         passwordLabel.color = "#000000";//设置 passwordLabel 的文本颜色。
 *         passwordLabel.bgColor = "#ccffff";//设置 passwordLabel 的背景颜色。
 *         passwordLabel.fontSize = 20;//设置 passwordLabel 的文本字体大小。
 *         Laya.stage.addChild(passwordLabel);//将 passwordLabel 添加到显示列表。
 *     }
 * }
 * @see laya.display.Text
 */
export declare class Label extends UIComponent {
    /**
     * @private
     * 文本 <code>Text</code> 实例。
     */
    protected _tf: Text;
    /**
     * 创建一个新的 <code>Label</code> 实例。
     * @param text 文本内容字符串。
     */
    constructor(text?: string);
    /**
     * @inheritDoc
     * @override
    */
    destroy(destroyChild?: boolean): void;
    /**
     * @override
     * @inheritDoc
    */
    protected createChildren(): void;
    /**
     * 当前文本内容字符串。
     * @see laya.display.Text.text
     */
    get text(): string;
    set text(value: string);
    /**@copy laya.display.Text#changeText()
     **/
    changeText(text: string): void;
    /**
     * @copy laya.display.Text#wordWrap
     */
    get wordWrap(): boolean;
    /**
     * @copy laya.display.Text#wordWrap
     */
    set wordWrap(value: boolean);
    /**
     * @copy laya.display.Text#color
     */
    get color(): string;
    set color(value: string);
    /**
     * @copy laya.display.Text#font
     */
    get font(): string;
    set font(value: string);
    /**
     * @copy laya.display.Text#align
     */
    get align(): string;
    set align(value: string);
    /**
     * @copy laya.display.Text#valign
     */
    get valign(): string;
    set valign(value: string);
    /**
     * @copy laya.display.Text#bold
     */
    get bold(): boolean;
    set bold(value: boolean);
    /**
     * @copy laya.display.Text#italic
     */
    get italic(): boolean;
    set italic(value: boolean);
    /**
     * @copy laya.display.Text#leading
     */
    get leading(): number;
    set leading(value: number);
    /**
     * @copy laya.display.Text#fontSize
     */
    get fontSize(): number;
    set fontSize(value: number);
    /**
     * <p>边距信息</p>
     * <p>"上边距，右边距，下边距 , 左边距（边距以像素为单位）"</p>
     * @see laya.display.Text.padding
     */
    get padding(): string;
    set padding(value: string);
    /**
     * @copy laya.display.Text#bgColor
     */
    get bgColor(): string;
    set bgColor(value: string);
    /**
     * @copy laya.display.Text#borderColor
     */
    get borderColor(): string;
    set borderColor(value: string);
    /**
     * @copy laya.display.Text#stroke
     */
    get stroke(): number;
    set stroke(value: number);
    /**
     * @copy laya.display.Text#strokeColor
     */
    get strokeColor(): string;
    set strokeColor(value: string);
    /**
     * 文本控件实体 <code>Text</code> 实例。
     */
    get textField(): Text;
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
     * @inheritDoc
     * @override
     */
    get width(): number;
    /**
     * @inheritDoc
     * @override
     */
    set width(value: number);
    /**
     * @inheritDoc
     * @override
     */
    get height(): number;
    /**
     * @inheritDoc
     * @override
     */
    set height(value: number);
    /**
     * @inheritDoc
     * @override
    */
    set dataSource(value: any);
    get dataSource(): any;
    /**
     * @copy laya.display.Text#overflow
     */
    get overflow(): string;
    /**
     * @copy laya.display.Text#overflow
     */
    set overflow(value: string);
    /**
     * @copy laya.display.Text#underline
     */
    get underline(): boolean;
    /**
     * @copy laya.display.Text#underline
     */
    set underline(value: boolean);
    /**
     * @copy laya.display.Text#underlineColor
     */
    get underlineColor(): string;
    /**
     * @copy laya.display.Text#underlineColor
     */
    set underlineColor(value: string);
}
