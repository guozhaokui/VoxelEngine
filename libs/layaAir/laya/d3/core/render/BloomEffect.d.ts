import { PostProcessEffect } from "./PostProcessEffect";
import { Color } from "../../math/Color";
import { Texture2D } from "../../../resource/Texture2D";
/**
 * <code>BloomEffect</code> 类用于创建泛光效果。
 */
export declare class BloomEffect extends PostProcessEffect {
    /**限制泛光像素的数量,该值在伽马空间。*/
    clamp: number;
    /**泛光颜色。*/
    color: Color;
    /**是否开启快速模式。该模式通过降低质量来提升性能。*/
    fastMode: boolean;
    /**镜头污渍纹路,用于为泛光特效增加污渍灰尘效果*/
    dirtTexture: Texture2D;
    /**
     * 获取泛光过滤器强度,最小值为0。
     * @return 强度。
     */
    get intensity(): number;
    /**
     * 设置泛光过滤器强度,最小值为0。
     * @param value 强度。
     */
    set intensity(value: number);
    /**
     * 设置泛光阈值,在该阈值亮度以下的像素会被过滤掉,该值在伽马空间。
     * @return 阈值。
     */
    get threshold(): number;
    /**
     * 获取泛光阈值,在该阈值亮度以下的像素会被过滤掉,该值在伽马空间。
     * @param value 阈值。
     */
    set threshold(value: number);
    /**
     * 获取软膝盖过渡强度,在阈值以下进行渐变过渡(0为完全硬过度,1为完全软过度)。
     * @return 软膝盖值。
     */
    get softKnee(): number;
    /**
     * 设置软膝盖过渡强度,在阈值以下进行渐变过渡(0为完全硬过度,1为完全软过度)。
     * @param value 软膝盖值。
     */
    set softKnee(value: number);
    /**
     * 获取扩散值,改变泛光的扩散范围,最好使用整数值保证效果,该值会改变内部的迭代次数,范围是1到10。
     * @return 光晕的扩散范围。
     */
    get diffusion(): number;
    /**
     * 设置扩散值,改变泛光的扩散范围,最好使用整数值保证效果,该值会改变内部的迭代次数,范围是1到10。
     * @param value 光晕的扩散范围。
     */
    set diffusion(value: number);
    /**
     * 获取形变比,通过扭曲泛光产生视觉上形变,负值为垂直扭曲,正值为水平扭曲。
     * @return 形变比。
     */
    get anamorphicRatio(): number;
    /**
     * 设置形变比,通过扭曲泛光产生视觉上形变,负值为垂直扭曲,正值为水平扭曲。
     * @param value 形变比。
     */
    set anamorphicRatio(value: number);
    /**
     * 获取污渍强度。
     * @return 污渍强度。
     */
    get dirtIntensity(): number;
    /**
     * 设置污渍强度。
     * @param value 污渍强度。
     */
    set dirtIntensity(value: number);
    /**
     * 创建一个 <code>BloomEffect</code> 实例。
     */
    constructor();
}
