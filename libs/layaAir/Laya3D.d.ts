import { Config3D } from "./Config3D";
import { PhysicsSettings } from "./laya/d3/physics/PhysicsSettings";
import { Handler } from "./laya/utils/Handler";
/**
 * <code>Laya3D</code> 类用于初始化3D设置。
 */
export declare class Laya3D {
    /**Hierarchy资源。*/
    static HIERARCHY: string;
    /**Mesh资源。*/
    static MESH: string;
    /**Material资源。*/
    static MATERIAL: string;
    /**Texture2D资源。*/
    static TEXTURE2D: string;
    /**TextureCube资源。*/
    static TEXTURECUBE: string;
    /**AnimationClip资源。*/
    static ANIMATIONCLIP: string;
    /**Avatar资源。*/
    static AVATAR: string;
    /**Terrain资源。*/
    static TERRAINHEIGHTDATA: string;
    /**Terrain资源。*/
    static TERRAINRES: string;
    /**@private */
    static physicsSettings: PhysicsSettings;
    /**
     * 获取是否可以启用物理。
     * @param 是否启用物理。
     */
    static get enablePhysics(): any;
    private static enableNative3D;
    /**
     *@private
     */
    private static formatRelativePath;
    /**
     * 初始化Laya3D相关设置。
     * @param	width  3D画布宽度。
     * @param	height 3D画布高度。
     */
    static init(width: number, height: number, config?: Config3D, compolete?: Handler): void;
    /**
     * 创建一个 <code>Laya3D</code> 实例。
     */
    constructor();
}
