import { Resource } from "../../../resource/Resource";
import { Handler } from "../../../utils/Handler";
import { DefineDatas } from "../../shader/DefineDatas";
import { ShaderData } from "../../shader/ShaderData";
import { IClone } from "../IClone";
import { ShaderDefine } from "../../shader/ShaderDefine";
/**
 * <code>Material</code> 类用于创建材质。
 */
export declare class Material extends Resource implements IClone {
    /**Material资源。*/
    static MATERIAL: string;
    /** 渲染队列_不透明。*/
    static RENDERQUEUE_OPAQUE: number;
    /** 渲染队列_阿尔法裁剪。*/
    static RENDERQUEUE_ALPHATEST: number;
    /** 渲染队列_透明。*/
    static RENDERQUEUE_TRANSPARENT: number;
    /**着色器变量,透明测试值。*/
    static ALPHATESTVALUE: number;
    /**材质级着色器宏定义,透明测试。*/
    static SHADERDEFINE_ALPHATEST: ShaderDefine;
    /**
     * 加载材质。
     * @param url 材质地址。
     * @param complete 完成回掉。
     */
    static load(url: string, complete: Handler): void;
    /**
     * @inheritDoc
     */
    static _parse(data: any, propertyParams?: any, constructParams?: any[]): Material;
    /** @private */
    _shaderValues: ShaderData;
    /** 所属渲染队列. */
    renderQueue: number;
    /**
     * 着色器数据。
     */
    get shaderData(): ShaderData;
    /**
     * 透明测试模式裁剪值。
     */
    get alphaTestValue(): number;
    set alphaTestValue(value: number);
    /**
     * 是否透明裁剪。
     */
    get alphaTest(): boolean;
    set alphaTest(value: boolean);
    /**
     * 创建一个 <code>BaseMaterial</code> 实例。
     */
    constructor();
    /**
     * @inheritDoc
     * @override
     */
    protected _disposeResource(): void;
    /**
     * 设置使用Shader名字。
     * @param name 名称。
     */
    setShaderName(name: string): void;
    /**
     * 克隆。
     * @param	destObject 克隆源。
     */
    cloneTo(destObject: any): void;
    /**
     * 克隆。
     * @return	 克隆副本。
     */
    clone(): any;
    get _defineDatas(): DefineDatas;
}
