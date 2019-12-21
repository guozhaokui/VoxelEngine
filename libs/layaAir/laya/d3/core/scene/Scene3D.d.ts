import { Sprite } from "../../../display/Sprite";
import { Context } from "../../../resource/Context";
import { ICreateResource } from "../../../resource/ICreateResource";
import { Texture2D } from "../../../resource/Texture2D";
import { Handler } from "../../../utils/Handler";
import { Timer } from "../../../utils/Timer";
import { ISubmit } from "../../../webgl/submit/ISubmit";
import { Input3D } from "../../Input3D";
import { Vector3 } from "../../math/Vector3";
import { PhysicsSimulation } from "../../physics/PhysicsSimulation";
import { SkyRenderer } from "../../resource/models/SkyRenderer";
import { TextureCube } from "../../resource/TextureCube";
import { ParallelSplitShadowMap } from "../../shadowMap/ParallelSplitShadowMap";
import { SphericalHarmonicsL2 } from "../../graphics/SphericalHarmonicsL2";
/**
 * 用于实现3D场景。
 */
export declare class Scene3D extends Sprite implements ISubmit, ICreateResource {
    /**Hierarchy资源。*/
    static HIERARCHY: string;
    /** 是否开启八叉树裁剪。*/
    static octreeCulling: boolean;
    /** 八叉树初始化尺寸。*/
    static octreeInitialSize: number;
    /** 八叉树初始化中心。*/
    static octreeInitialCenter: Vector3;
    /** 八叉树最小尺寸。*/
    static octreeMinNodeSize: number;
    /** 八叉树松散值。*/
    static octreeLooseness: number;
    static REFLECTIONMODE_SKYBOX: number;
    static REFLECTIONMODE_CUSTOM: number;
    static FOGCOLOR: number;
    static FOGSTART: number;
    static FOGRANGE: number;
    static DIRECTIONLIGHTCOUNT: number;
    static LIGHTBUFFER: number;
    static CLUSTERBUFFER: number;
    static SUNLIGHTDIRECTION: number;
    static SUNLIGHTDIRCOLOR: number;
    static AMBIENTPROBE: number;
    static REFLECTIONPROBE: number;
    static LIGHTDIRECTION: number;
    static LIGHTDIRCOLOR: number;
    static POINTLIGHTPOS: number;
    static POINTLIGHTRANGE: number;
    static POINTLIGHTATTENUATION: number;
    static POINTLIGHTCOLOR: number;
    static SPOTLIGHTPOS: number;
    static SPOTLIGHTDIRECTION: number;
    static SPOTLIGHTSPOTANGLE: number;
    static SPOTLIGHTRANGE: number;
    static SPOTLIGHTCOLOR: number;
    static SHADOWDISTANCE: number;
    static SHADOWLIGHTVIEWPROJECT: number;
    static SHADOWMAPPCFOFFSET: number;
    static SHADOWMAPTEXTURE1: number;
    static SHADOWMAPTEXTURE2: number;
    static SHADOWMAPTEXTURE3: number;
    static AMBIENTCOLOR: number;
    static REFLECTIONTEXTURE: number;
    static REFLETIONINTENSITY: number;
    static TIME: number;
    /**
     * 加载场景,注意:不缓存。
     * @param url 模板地址。
     * @param complete 完成回调。
     */
    static load(url: string, complete: Handler): void;
    /** 当前创建精灵所属遮罩层。*/
    currentCreationLayer: number;
    /** 是否启用灯光。*/
    enableLight: boolean;
    /** 全局的环境光探头。 */
    ambientProbe: SphericalHarmonicsL2;
    /**	全局的反射探头。 */
    reflectionProbe: TextureCube;
    parallelSplitShadowMaps: ParallelSplitShadowMap[];
    /**
     * 资源的URL地址。
     */
    get url(): string;
    /**
     * 是否允许雾化。
     */
    get enableFog(): boolean;
    set enableFog(value: boolean);
    /**
     * 雾化颜色。
     */
    get fogColor(): Vector3;
    set fogColor(value: Vector3);
    /**
     * 雾化起始位置。
     */
    get fogStart(): number;
    set fogStart(value: number);
    /**
     * 雾化范围。
     */
    get fogRange(): number;
    set fogRange(value: number);
    /**
     * 环境光颜色。
     */
    get ambientColor(): Vector3;
    set ambientColor(value: Vector3);
    /**
     * 天空渲染器。
     */
    get skyRenderer(): SkyRenderer;
    /**
     * 反射贴图。
     */
    get customReflection(): TextureCube;
    set customReflection(value: TextureCube);
    /**
     * 反射强度。
     */
    get reflectionIntensity(): number;
    set reflectionIntensity(value: number);
    /**
     * 物理模拟器。
     */
    get physicsSimulation(): PhysicsSimulation;
    /**
     * 反射模式。
     */
    get reflectionMode(): number;
    set reflectionMode(value: number);
    /**
     * 场景时钟。
     * @override
     */
    get timer(): Timer;
    set timer(value: Timer);
    /**
     *	输入。
     */
    get input(): Input3D;
    /**
     * 创建一个 <code>Scene3D</code> 实例。
     */
    constructor();
    /**
     */
    _setCreateURL(url: string): void;
    /**
     * @inheritDoc
     * @override
     */
    protected _onActive(): void;
    /**
     * @inheritDoc
     * @override
     */
    protected _onInActive(): void;
    /**
     * 设置光照贴图。
     * @param value 光照贴图。
     */
    setlightmaps(value: Texture2D[]): void;
    /**
     * 获取光照贴图浅拷贝列表。
     * @return 获取光照贴图浅拷贝列表。
     */
    getlightmaps(): Texture2D[];
    /**
     * @inheritDoc
     * @override
     */
    destroy(destroyChild?: boolean): void;
    /**
     *
     */
    renderSubmit(): number;
    /**
     *
     */
    getRenderType(): number;
    /**
     *
     */
    releaseRender(): void;
    /**
     *
     */
    reUse(context: Context, pos: number): number;
}
