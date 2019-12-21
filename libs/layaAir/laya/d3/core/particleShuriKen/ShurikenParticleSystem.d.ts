import { Vector3 } from "../../math/Vector3";
import { Vector4 } from "../../math/Vector4";
import { GeometryElement } from "../GeometryElement";
import { IClone } from "../IClone";
import { ColorOverLifetime } from "./module/ColorOverLifetime";
import { Emission } from "./module/Emission";
import { GradientDataNumber } from "./module/GradientDataNumber";
import { RotationOverLifetime } from "./module/RotationOverLifetime";
import { BaseShape } from "./module/shape/BaseShape";
import { SizeOverLifetime } from "./module/SizeOverLifetime";
import { TextureSheetAnimation } from "./module/TextureSheetAnimation";
import { VelocityOverLifetime } from "./module/VelocityOverLifetime";
import { ShuriKenParticle3D } from "./ShuriKenParticle3D";
/**
 * <code>ShurikenParticleSystem</code> 类用于创建3D粒子数据模板。
 */
export declare class ShurikenParticleSystem extends GeometryElement implements IClone {
    /**粒子运行的总时长，单位为秒。*/
    duration: number;
    /**是否循环。*/
    looping: boolean;
    /**是否预热。暂不支持*/
    prewarm: boolean;
    /**开始延迟类型，0为常量模式,1为随机随机双常量模式，不能和prewarm一起使用。*/
    startDelayType: number;
    /**开始播放延迟，不能和prewarm一起使用。*/
    startDelay: number;
    /**开始播放最小延迟，不能和prewarm一起使用。*/
    startDelayMin: number;
    /**开始播放最大延迟，不能和prewarm一起使用。*/
    startDelayMax: number;
    /**开始速度模式，0为恒定速度，2为两个恒定速度的随机插值。缺少1、3模式*/
    startSpeedType: number;
    /**开始速度,0模式。*/
    startSpeedConstant: number;
    /**最小开始速度,1模式。*/
    startSpeedConstantMin: number;
    /**最大开始速度,1模式。*/
    startSpeedConstantMax: number;
    /**开始尺寸是否为3D模式。*/
    threeDStartSize: boolean;
    /**开始尺寸模式,0为恒定尺寸，2为两个恒定尺寸的随机插值。缺少1、3模式和对应的二种3D模式*/
    startSizeType: number;
    /**开始尺寸，0模式。*/
    startSizeConstant: number;
    /**开始三维尺寸，0模式。*/
    startSizeConstantSeparate: Vector3;
    /**最小开始尺寸，2模式。*/
    startSizeConstantMin: number;
    /**最大开始尺寸，2模式。*/
    startSizeConstantMax: number;
    /**最小三维开始尺寸，2模式。*/
    startSizeConstantMinSeparate: Vector3;
    /**最大三维开始尺寸，2模式。*/
    startSizeConstantMaxSeparate: Vector3;
    /**3D开始旋转。*/
    threeDStartRotation: boolean;
    /**开始旋转模式,0为恒定尺寸，2为两个恒定旋转的随机插值,缺少2种模式,和对应的四种3D模式。*/
    startRotationType: number;
    /**开始旋转，0模式。*/
    startRotationConstant: number;
    /**开始三维旋转，0模式。*/
    startRotationConstantSeparate: Vector3;
    /**最小开始旋转，1模式。*/
    startRotationConstantMin: number;
    /**最大开始旋转，1模式。*/
    startRotationConstantMax: number;
    /**最小开始三维旋转，1模式。*/
    startRotationConstantMinSeparate: Vector3;
    /**最大开始三维旋转，1模式。*/
    startRotationConstantMaxSeparate: Vector3;
    /**随机旋转方向，范围为0.0到1.0*/
    randomizeRotationDirection: number;
    /**开始颜色模式，0为恒定颜色，2为两个恒定颜色的随机插值,缺少2种模式。*/
    startColorType: number;
    /**开始颜色，0模式。*/
    startColorConstant: Vector4;
    /**最小开始颜色，1模式。*/
    startColorConstantMin: Vector4;
    /**最大开始颜色，1模式。*/
    startColorConstantMax: Vector4;
    /**重力敏感度。*/
    gravityModifier: number;
    /**模拟器空间,0为World,1为Local。暂不支持Custom。*/
    simulationSpace: number;
    /**粒子的播放速度。 */
    simulationSpeed: number;
    /**缩放模式，0为Hiercachy,1为Local,2为World。*/
    scaleMode: number;
    /**激活时是否自动播放。*/
    playOnAwake: boolean;
    /**随机种子,注:play()前设置有效。*/
    randomSeed: Uint32Array;
    /**是否使用随机种子。 */
    autoRandomSeed: boolean;
    /**是否为性能模式,性能模式下会延迟粒子释放。*/
    isPerformanceMode: boolean;
    /**最大粒子数。*/
    get maxParticles(): number;
    set maxParticles(value: number);
    /**
     * 获取发射器。
     */
    get emission(): Emission;
    /**
     * 粒子存活个数。
     */
    get aliveParticleCount(): number;
    /**
     * 获取一次循环内的累计时间。
     * @return 一次循环内的累计时间。
     */
    get emissionTime(): number;
    /**
     * 形状。
     */
    get shape(): BaseShape;
    set shape(value: BaseShape);
    /**
     * 是否存活。
     */
    get isAlive(): boolean;
    /**
     * 是否正在发射。
     */
    get isEmitting(): boolean;
    /**
     * 是否正在播放。
     */
    get isPlaying(): boolean;
    /**
     * 是否已暂停。
     */
    get isPaused(): boolean;
    /**
     * 开始生命周期模式,0为固定时间，1为渐变时间，2为两个固定之间的随机插值,3为两个渐变时间的随机插值。
     */
    get startLifetimeType(): number;
    set startLifetimeType(value: number);
    /**
     * 开始生命周期，0模式,单位为秒。
     */
    get startLifetimeConstant(): number;
    set startLifetimeConstant(value: number);
    /**
     * 开始渐变生命周期，1模式,单位为秒。
     */
    get startLifeTimeGradient(): GradientDataNumber;
    set startLifeTimeGradient(value: GradientDataNumber);
    /**
     * 最小开始生命周期，2模式,单位为秒。
     */
    get startLifetimeConstantMin(): number;
    set startLifetimeConstantMin(value: number);
    /**
     * 最大开始生命周期，2模式,单位为秒。
     */
    get startLifetimeConstantMax(): number;
    set startLifetimeConstantMax(value: number);
    /**
     * 开始渐变最小生命周期，3模式,单位为秒。
     */
    get startLifeTimeGradientMin(): GradientDataNumber;
    set startLifeTimeGradientMin(value: GradientDataNumber);
    /**
     * 开始渐变最大生命周期，3模式,单位为秒。
     */
    get startLifeTimeGradientMax(): GradientDataNumber;
    set startLifeTimeGradientMax(value: GradientDataNumber);
    /**
     * 生命周期速度,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
     */
    get velocityOverLifetime(): VelocityOverLifetime;
    set velocityOverLifetime(value: VelocityOverLifetime);
    /**
     * 生命周期颜色,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
     */
    get colorOverLifetime(): ColorOverLifetime;
    set colorOverLifetime(value: ColorOverLifetime);
    /**
     * 生命周期尺寸,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
     */
    get sizeOverLifetime(): SizeOverLifetime;
    set sizeOverLifetime(value: SizeOverLifetime);
    /**
     * 生命周期旋转,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
     */
    get rotationOverLifetime(): RotationOverLifetime;
    set rotationOverLifetime(value: RotationOverLifetime);
    /**
     * 生命周期纹理动画,注意:如修改该值的某些属性,需重新赋值此属性才可生效。
     */
    get textureSheetAnimation(): TextureSheetAnimation;
    set textureSheetAnimation(value: TextureSheetAnimation);
    constructor(owner: ShuriKenParticle3D);
    /**
     * 发射一个粒子。
     */
    emit(time: number): boolean;
    addParticle(position: Vector3, direction: Vector3, time: number): boolean;
    addNewParticlesToVertexBuffer(): void;
    /**
     * @inheritDoc
     * @override
     */
    _getType(): number;
    /**
     * 开始发射粒子。
     */
    play(): void;
    /**
     * 暂停发射粒子。
     */
    pause(): void;
    /**
     * 通过指定时间增加粒子播放进度，并暂停播放。
     * @param time 进度时间.如果restart为true,粒子播放时间会归零后再更新进度。
     * @param restart 是否重置播放状态。
     */
    simulate(time: number, restart?: boolean): void;
    /**
     * 停止发射粒子。
     */
    stop(): void;
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
}
