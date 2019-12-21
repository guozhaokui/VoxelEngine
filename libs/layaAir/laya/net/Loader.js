import { ILaya } from "../../ILaya";
import { Prefab } from "../components/Prefab";
import { Text } from "../display/Text";
import { Event } from "../events/Event";
import { EventDispatcher } from "../events/EventDispatcher";
import { SoundManager } from "../media/SoundManager";
import { BaseTexture } from "../resource/BaseTexture";
import { Texture } from "../resource/Texture";
import { Texture2D } from "../resource/Texture2D";
import { Browser } from "../utils/Browser";
import { Byte } from "../utils/Byte";
import { Handler } from "../utils/Handler";
import { Utils } from "../utils/Utils";
import { BitmapFont } from "./../display/BitmapFont";
import { HttpRequest } from "./HttpRequest";
import { URL } from "./URL";
import { TextureFormat } from "../resource/TextureFormat";
/**
 * 加载进度发生改变时调度。
 * @eventType Event.PROGRESS
 * */
/*[Event(name = "progress", type = "laya.events.Event")]*/
/**
 * 加载完成后调度。
 * @eventType Event.COMPLETE
 * */
/*[Event(name = "complete", type = "laya.events.Event")]*/
/**
 * 加载出错时调度。
 * @eventType Event.ERROR
 * */
/*[Event(name = "error", type = "laya.events.Event")]*/
/**
 * <code>Loader</code> 类可用来加载文本、JSON、XML、二进制、图像等资源。
 */
export class Loader extends EventDispatcher {
    constructor() {
        super(...arguments);
        /**@internal 自定义解析不派发complete事件，但会派发loaded事件，手动调用endLoad方法再派发complete事件*/
        this._customParse = false;
    }
    /**
     * 获取指定资源地址的数据类型。
     * @param	url 资源地址。
     * @return 数据类型。
     */
    static getTypeFromUrl(url) {
        var type = Utils.getFileExtension(url);
        if (type)
            return Loader.typeMap[type];
        console.warn("Not recognize the resources suffix", url);
        return "text";
    }
    /**
     * 加载资源。加载错误会派发 Event.ERROR 事件，参数为错误信息。
     * @param	url			资源地址。
     * @param	type		(default = null)资源类型。可选值为：Loader.TEXT、Loader.JSON、Loader.XML、Loader.BUFFER、Loader.IMAGE、Loader.SOUND、Loader.ATLAS、Loader.FONT。如果为null，则根据文件后缀分析类型。
     * @param	cache		(default = true)是否缓存数据。
     * @param	group		(default = null)分组名称。
     * @param	ignoreCache (default = false)是否忽略缓存，强制重新加载。
     * @param	useWorkerLoader(default = false)是否使用worker加载（只针对IMAGE类型和ATLAS类型，并且浏览器支持的情况下生效）
     */
    load(url, type = null, cache = true, group = null, ignoreCache = false, useWorkerLoader = ILaya.WorkerLoader.enable) {
        if (!url) {
            this.onLoaded(null);
            return;
        }
        Loader.setGroup(url, "666");
        this._url = url;
        if (url.indexOf("data:image") === 0)
            type = Loader.IMAGE;
        else
            url = URL.formatURL(url);
        this._type = type || (type = Loader.getTypeFromUrl(this._url));
        this._cache = cache;
        this._useWorkerLoader = useWorkerLoader;
        this._data = null;
        if (useWorkerLoader)
            ILaya.WorkerLoader.enableWorkerLoader();
        var cacheRes;
        if (type == Loader.IMAGE)
            cacheRes = Loader.textureMap[url];
        else
            cacheRes = Loader.loadedMap[url];
        if (!ignoreCache && cacheRes) {
            this._data = cacheRes;
            this.event(Event.PROGRESS, 1);
            this.event(Event.COMPLETE, this._data);
            return;
        }
        if (group)
            Loader.setGroup(url, group);
        //如果自定义了解析器，则自己解析，自定义解析不派发complete事件，但会派发loaded事件，手动调用endLoad方法再派发complete事件
        if (Loader.parserMap[type] != null) {
            this._customParse = true;
            if (Loader.parserMap[type] instanceof Handler)
                Loader.parserMap[type].runWith(this);
            else
                Loader.parserMap[type].call(null, this);
            return;
        }
        this._loadResourceFilter(type, url);
    }
    /**
     * @internal
     */
    _loadResourceFilter(type, url) {
        this._loadResource(type, url);
    }
    /**
     * @internal
     */
    _loadResource(type, url) {
        switch (type) {
            case Loader.IMAGE:
            case "htmlimage": //内部类型
            case "nativeimage": //内部类型
                this._loadImage(url);
                break;
            case Loader.SOUND:
                this._loadSound(url);
                break;
            case Loader.TTF:
                this._loadTTF(url);
                break;
            case Loader.ATLAS:
            case Loader.PREFAB:
            case Loader.PLF:
                this._loadHttpRequestWhat(url, Loader.JSON);
                break;
            case Loader.FONT:
                this._loadHttpRequestWhat(url, Loader.XML);
                break;
            case Loader.PLFB:
                this._loadHttpRequestWhat(url, Loader.BUFFER);
                break;
            default:
                this._loadHttpRequestWhat(url, type);
        }
    }
    /**
     * @private
     * onload、onprocess、onerror必须写在本类
     */
    _loadHttpRequest(url, contentType, onLoadCaller, onLoad, onProcessCaller, onProcess, onErrorCaller, onError) {
        if (Browser.onVVMiniGame) {
            this._http = new HttpRequest(); //临时修复vivo复用xmlhttprequest的bug
        }
        else {
            if (!this._http)
                this._http = new HttpRequest();
        }
        onProcess && this._http.on(Event.PROGRESS, onProcessCaller, onProcess);
        onLoad && this._http.on(Event.COMPLETE, onLoadCaller, onLoad);
        this._http.on(Event.ERROR, onErrorCaller, onError);
        this._http.send(url, null, "get", contentType);
    }
    /**
     * @private
     */
    _loadHtmlImage(url, onLoadCaller, onLoad, onErrorCaller, onError) {
        var image;
        function clear() {
            var img = image;
            img.onload = null;
            img.onerror = null;
            delete Loader._imgCache[url];
        }
        var onerror = function () {
            clear();
            onError.call(onErrorCaller);
        };
        var onload = function () {
            clear();
            onLoad.call(onLoadCaller, image);
        };
        image = new Browser.window.Image();
        image.crossOrigin = "";
        image.onload = onload;
        image.onerror = onerror;
        image.src = url;
        Loader._imgCache[url] = image; //增加引用，防止垃圾回收
    }
    /**
     * @internal
     */
    _loadHttpRequestWhat(url, contentType) {
        if (Loader.preLoadedMap[url])
            this.onLoaded(Loader.preLoadedMap[url]);
        else
            this._loadHttpRequest(url, contentType, this, this.onLoaded, this, this.onProgress, this, this.onError);
    }
    /**
     * @private
     * 加载TTF资源。
     * @param	url 资源地址。
     */
    _loadTTF(url) {
        url = URL.formatURL(url);
        var ttfLoader = new ILaya.TTFLoader();
        ttfLoader.complete = Handler.create(this, this.onLoaded);
        ttfLoader.load(url);
    }
    /**
     * @private
     */
    _loadImage(url, isformatURL = true) {
        var _this = this;
        if (isformatURL)
            url = URL.formatURL(url);
        var onLoaded;
        var onError = function () {
            _this.event(Event.ERROR, "Load image failed");
        };
        if (this._type === "nativeimage") {
            onLoaded = (image) => {
                this.onLoaded(image);
            };
            this._loadHtmlImage(url, this, onLoaded, this, onError);
        }
        else {
            var ext = Utils.getFileExtension(url);
            if (ext === "ktx" || ext === "pvr") {
                onLoaded = function (imageData) {
                    let format;
                    switch (ext) {
                        case "ktx":
                            format = TextureFormat.ETC1RGB;
                            break;
                        case "pvr":
                            format = TextureFormat.PVRTCRGBA_4BPPV;
                            break;
                        default: {
                            console.error('unknown format', ext);
                            return;
                        }
                    }
                    var tex = new Texture2D(0, 0, format, false, false);
                    tex.wrapModeU = BaseTexture.WARPMODE_CLAMP;
                    tex.wrapModeV = BaseTexture.WARPMODE_CLAMP;
                    tex.setCompressData(imageData);
                    tex._setCreateURL(url);
                    _this.onLoaded(tex);
                };
                this._loadHttpRequest(url, Loader.BUFFER, this, onLoaded, null, null, this, onError);
            }
            else {
                onLoaded = function (image) {
                    var tex = new Texture2D(image.width, image.height, 1, false, false);
                    tex.wrapModeU = BaseTexture.WARPMODE_CLAMP;
                    tex.wrapModeV = BaseTexture.WARPMODE_CLAMP;
                    tex.loadImageSource(image, true);
                    tex._setCreateURL(url);
                    _this.onLoaded(tex);
                };
                this._loadHtmlImage(url, this, onLoaded, this, onError);
            }
        }
    }
    /**
     * @internal
     * 加载声音资源。
     * @param	url 资源地址。
     */
    _loadSound(url) {
        var sound = (new SoundManager._soundClass());
        var _this = this;
        sound.on(Event.COMPLETE, this, soundOnload);
        sound.on(Event.ERROR, this, soundOnErr);
        sound.load(url);
        function soundOnload() {
            clear();
            _this.onLoaded(sound);
        }
        function soundOnErr() {
            clear();
            sound.dispose();
            _this.event(Event.ERROR, "Load sound failed");
        }
        function clear() {
            sound.offAll();
        }
    }
    /**@private */
    onProgress(value) {
        if (this._type === Loader.ATLAS)
            this.event(Event.PROGRESS, value * 0.3);
        else
            this.event(Event.PROGRESS, value);
    }
    /**@private */
    onError(message) {
        this.event(Event.ERROR, message);
    }
    /**
     * 资源加载完成的处理函数。
     * @param	data 数据。
     */
    onLoaded(data = null) {
        var type = this._type;
        if (type == Loader.PLFB) {
            this.parsePLFBData(data);
            this.complete(data);
        }
        else if (type == Loader.PLF) {
            this.parsePLFData(data);
            this.complete(data);
        }
        else if (type === Loader.IMAGE) {
            var tex = new Texture(data);
            tex.url = this._url;
            this.complete(tex);
        }
        else if (type === Loader.SOUND || type === "htmlimage" || type === "nativeimage") {
            this.complete(data);
        }
        else if (type === Loader.ATLAS) {
            //处理图集
            if (!(data instanceof Texture2D)) {
                var toloadPics = [];
                if (!this._data) {
                    this._data = data;
                    //let cdt = data as Texture2D;
                    //构造加载图片信息
                    if (data.meta && data.meta.image) {
                        //带图片信息的类型
                        toloadPics = data.meta.image.split(",");
                        var split = this._url.indexOf("/") >= 0 ? "/" : "\\";
                        var idx = this._url.lastIndexOf(split);
                        var folderPath = idx >= 0 ? this._url.substr(0, idx + 1) : "";
                        var changeType = null;
                        if (Browser.onAndroid && data.meta.compressTextureAndroid) {
                            changeType = ".ktx";
                        }
                        if (Browser.onIOS && data.meta.compressTextureIOS) {
                            changeType = ".pvr";
                        }
                        //idx = _url.indexOf("?");
                        //var ver:String;
                        //ver = idx >= 0 ? _url.substr(idx) : "";
                        for (var i = 0, len = toloadPics.length; i < len; i++) {
                            if (changeType) {
                                toloadPics[i] = folderPath + toloadPics[i].replace(".png", changeType);
                            }
                            else {
                                toloadPics[i] = folderPath + toloadPics[i];
                            }
                        }
                    }
                    else {
                        //不带图片信息
                        toloadPics = [this._url.replace(".json", ".png")];
                    }
                    //保证图集的正序加载
                    toloadPics.reverse();
                    data.toLoads = toloadPics;
                    data.pics = [];
                }
                this.event(Event.PROGRESS, 0.3 + 1 / toloadPics.length * 0.6);
                return this._loadResourceFilter(Loader.IMAGE, toloadPics.pop());
            }
            else {
                this._data.pics.push(data);
                if (this._data.toLoads.length > 0) {
                    this.event(Event.PROGRESS, 0.3 + 1 / this._data.toLoads.length * 0.6);
                    //有图片未加载
                    return this._loadResourceFilter(Loader.IMAGE, this._data.toLoads.pop());
                }
                var frames = this._data.frames;
                var cleanUrl = this._url.split("?")[0];
                var directory = (this._data.meta && this._data.meta.prefix) ? this._data.meta.prefix : cleanUrl.substring(0, cleanUrl.lastIndexOf(".")) + "/";
                var pics = this._data.pics;
                var atlasURL = URL.formatURL(this._url);
                var map = Loader.atlasMap[atlasURL] || (Loader.atlasMap[atlasURL] = []);
                map.dir = directory;
                var scaleRate = 1;
                if (this._data.meta && this._data.meta.scale && this._data.meta.scale != 1) {
                    scaleRate = parseFloat(this._data.meta.scale);
                    for (var name in frames) {
                        var obj = frames[name]; //取对应的图
                        var tPic = pics[obj.frame.idx ? obj.frame.idx : 0]; //是否释放
                        var url = URL.formatURL(directory + name);
                        tPic.scaleRate = scaleRate;
                        var tTexture;
                        tTexture = Texture._create(tPic, obj.frame.x, obj.frame.y, obj.frame.w, obj.frame.h, obj.spriteSourceSize.x, obj.spriteSourceSize.y, obj.sourceSize.w, obj.sourceSize.h, Loader.getRes(url));
                        Loader.cacheTexture(url, tTexture);
                        tTexture.url = url;
                        map.push(url);
                    }
                }
                else {
                    for (name in frames) {
                        obj = frames[name]; //取对应的图
                        tPic = pics[obj.frame.idx ? obj.frame.idx : 0]; //是否释放
                        url = URL.formatURL(directory + name);
                        tTexture = Texture._create(tPic, obj.frame.x, obj.frame.y, obj.frame.w, obj.frame.h, obj.spriteSourceSize.x, obj.spriteSourceSize.y, obj.sourceSize.w, obj.sourceSize.h, Loader.getRes(url));
                        Loader.cacheTexture(url, tTexture);
                        tTexture.url = url;
                        map.push(url);
                    }
                }
                delete this._data.pics;
                this.complete(this._data);
            }
        }
        else if (type === Loader.FONT) {
            //处理位图字体
            if (!data._source) {
                this._data = data;
                this.event(Event.PROGRESS, 0.5);
                return this._loadResourceFilter(Loader.IMAGE, this._url.replace(".fnt", ".png"));
            }
            else {
                var bFont = new BitmapFont();
                bFont.parseFont(this._data, new Texture(data));
                var tArr = this._url.split(".fnt")[0].split("/");
                var fontName = tArr[tArr.length - 1];
                Text.registerBitmapFont(fontName, bFont);
                this._data = bFont;
                this.complete(this._data);
            }
        }
        else if (type === Loader.PREFAB) {
            var prefab = new Prefab();
            prefab.json = data;
            this.complete(prefab);
        }
        else {
            this.complete(data);
        }
    }
    parsePLFData(plfData) {
        var type;
        var filePath;
        var fileDic;
        for (type in plfData) {
            fileDic = plfData[type];
            switch (type) {
                case "json":
                case "text":
                    for (filePath in fileDic) {
                        Loader.preLoadedMap[URL.formatURL(filePath)] = fileDic[filePath];
                    }
                    break;
                default:
                    for (filePath in fileDic) {
                        Loader.preLoadedMap[URL.formatURL(filePath)] = fileDic[filePath];
                    }
            }
        }
    }
    parsePLFBData(plfData) {
        var byte;
        byte = new Byte(plfData);
        var i, len;
        len = byte.getInt32();
        for (i = 0; i < len; i++) {
            this.parseOnePLFBFile(byte);
        }
    }
    parseOnePLFBFile(byte) {
        var fileLen;
        var fileName;
        var fileData;
        fileName = byte.getUTFString();
        fileLen = byte.getInt32();
        fileData = byte.readArrayBuffer(fileLen);
        Loader.preLoadedMap[URL.formatURL(fileName)] = fileData;
    }
    /**
     * 加载完成。
     * @param	data 加载的数据。
     */
    complete(data) {
        this._data = data;
        if (this._customParse) {
            this.event(Event.LOADED, data instanceof Array ? [data] : data);
        }
        else {
            Loader._loaders.push(this);
            if (!Loader._isWorking)
                Loader.checkNext();
        }
    }
    /**@private */
    static checkNext() {
        Loader._isWorking = true;
        var startTimer = Browser.now();
        while (Loader._startIndex < Loader._loaders.length) {
            Loader._loaders[Loader._startIndex].endLoad();
            Loader._startIndex++;
            if (Browser.now() - startTimer > Loader.maxTimeOut) {
                console.warn("loader callback cost a long time:" + (Browser.now() - startTimer) + " url=" + Loader._loaders[Loader._startIndex - 1].url);
                ILaya.systemTimer.frameOnce(1, null, Loader.checkNext);
                return;
            }
        }
        Loader._loaders.length = 0;
        Loader._startIndex = 0;
        Loader._isWorking = false;
    }
    /**
     * 结束加载，处理是否缓存及派发完成事件 <code>Event.COMPLETE</code> 。
     * @param	content 加载后的数据
     */
    endLoad(content = null) {
        content && (this._data = content);
        if (this._cache)
            Loader.cacheRes(this._url, this._data);
        this.event(Event.PROGRESS, 1);
        this.event(Event.COMPLETE, this.data instanceof Array ? [this.data] : this.data);
    }
    /**加载地址。*/
    get url() {
        return this._url;
    }
    /**加载类型。*/
    get type() {
        return this._type;
    }
    /**是否缓存。*/
    get cache() {
        return this._cache;
    }
    /**返回的数据。*/
    get data() {
        return this._data;
    }
    /**
     * 清理指定资源地址的缓存。
     * @param url 资源地址。
     */
    static clearRes(url) {
        url = URL.formatURL(url);
        //删除图集
        var arr = Loader.getAtlas(url);
        if (arr) {
            for (var i = 0, n = arr.length; i < n; i++) {
                var resUrl = arr[i];
                var tex = Loader.getRes(resUrl);
                delete Loader.textureMap[resUrl];
                if (tex)
                    tex.destroy();
            }
            arr.length = 0;
            delete Loader.atlasMap[url];
        }
        var texture = Loader.textureMap[url];
        if (texture) {
            texture.destroy();
            delete Loader.textureMap[url];
        }
        var res = Loader.loadedMap[url];
        (res) && (delete Loader.loadedMap[url]);
    }
    /**
     * 销毁Texture使用的图片资源，保留texture壳，如果下次渲染的时候，发现texture使用的图片资源不存在，则会自动恢复
     * 相比clearRes，clearTextureRes只是清理texture里面使用的图片资源，并不销毁texture，再次使用到的时候会自动恢复图片资源
     * 而clearRes会彻底销毁texture，导致不能再使用；clearTextureRes能确保立即销毁图片资源，并且不用担心销毁错误，clearRes则采用引用计数方式销毁
     * 【注意】如果图片本身在自动合集里面（默认图片小于512*512），内存是不能被销毁的，此图片被大图合集管理器管理
     * @param	url	图集地址或者texture地址，比如 Loader.clearTextureRes("res/atlas/comp.atlas"); Loader.clearTextureRes("hall/bg.jpg");
     */
    static clearTextureRes(url) {
        url = URL.formatURL(url);
        //删除图集
        var arr = Loader.getAtlas(url);
        if (arr && arr.length > 0) {
            arr.forEach(function (t) {
                var tex = Loader.getRes(t);
                if (tex instanceof Texture) {
                    tex.disposeBitmap();
                }
            });
        }
        else {
            var t = Loader.getRes(url);
            if (t instanceof Texture) {
                t.disposeBitmap();
            }
        }
    }
    /**
     * 获取指定资源地址的资源或纹理。
     * @param	url 资源地址。
     * @return	返回资源。
     */
    static getRes(url) {
        var res = Loader.textureMap[URL.formatURL(url)];
        if (res)
            return res;
        else
            return Loader.loadedMap[URL.formatURL(url)];
    }
    /**
     * 获取指定资源地址的图集地址列表。
     * @param	url 图集地址。
     * @return	返回地址集合。
     */
    static getAtlas(url) {
        return Loader.atlasMap[URL.formatURL(url)];
    }
    /**
     * 缓存资源。
     * @param	url 资源地址。
     * @param	data 要缓存的内容。
     */
    static cacheRes(url, data) {
        url = URL.formatURL(url);
        if (Loader.loadedMap[url] != null) {
            console.warn("Resources already exist,is repeated loading:", url);
        }
        else {
            if (data instanceof Texture) {
                Loader.loadedMap[url] = data.bitmap;
                Loader.textureMap[url] = data;
            }
            else {
                Loader.loadedMap[url] = data;
            }
        }
    }
    /**
     * 缓存Teture。
     * @param	url 资源地址。
     * @param	data 要缓存的Texture。
     */
    static cacheTexture(url, data) {
        url = URL.formatURL(url);
        if (Loader.textureMap[url] != null) {
            console.warn("Resources already exist,is repeated loading:", url);
        }
        else {
            Loader.textureMap[url] = data;
        }
    }
    /**
     * 设置资源分组。
     * @param url 资源地址。
     * @param group 分组名。
     */
    static setGroup(url, group) {
        if (!Loader.groupMap[group])
            Loader.groupMap[group] = [];
        Loader.groupMap[group].push(url);
    }
    /**
     * 根据分组清理资源。
     * @param group 分组名。
     */
    static clearResByGroup(group) {
        if (!Loader.groupMap[group])
            return;
        var arr = Loader.groupMap[group], i, len = arr.length;
        for (i = 0; i < len; i++) {
            Loader.clearRes(arr[i]);
        }
        arr.length = 0;
    }
}
/**文本类型，加载完成后返回文本。*/
Loader.TEXT = "text";
/**JSON 类型，加载完成后返回json数据。*/
Loader.JSON = "json";
/**prefab 类型，加载完成后返回Prefab实例。*/
Loader.PREFAB = "prefab";
/**XML 类型，加载完成后返回domXML。*/
Loader.XML = "xml";
/**二进制类型，加载完成后返回arraybuffer二进制数据。*/
Loader.BUFFER = "arraybuffer";
/**纹理类型，加载完成后返回Texture。*/
Loader.IMAGE = "image";
/**声音类型，加载完成后返回sound。*/
Loader.SOUND = "sound";
/**图集类型，加载完成后返回图集json信息(并创建图集内小图Texture)。*/
Loader.ATLAS = "atlas";
/**位图字体类型，加载完成后返回BitmapFont，加载后，会根据文件名自动注册为位图字体。*/
Loader.FONT = "font";
/** TTF字体类型，加载完成后返回null。*/
Loader.TTF = "ttf";
/** 预加载文件类型，加载完成后自动解析到preLoadedMap。*/
Loader.PLF = "plf";
/** 二进制预加载文件类型，加载完成后自动解析到preLoadedMap。*/
Loader.PLFB = "plfb";
/**Hierarchy资源。*/
Loader.HIERARCHY = "HIERARCHY";
/**Mesh资源。*/
Loader.MESH = "MESH";
/**Material资源。*/
Loader.MATERIAL = "MATERIAL";
/**Texture2D资源。*/
Loader.TEXTURE2D = "TEXTURE2D";
/**TextureCube资源。*/
Loader.TEXTURECUBE = "TEXTURECUBE";
/**AnimationClip资源。*/
Loader.ANIMATIONCLIP = "ANIMATIONCLIP";
/**Avatar资源。*/
Loader.AVATAR = "AVATAR";
/**Terrain资源。*/
Loader.TERRAINHEIGHTDATA = "TERRAINHEIGHTDATA";
/**Terrain资源。*/
Loader.TERRAINRES = "TERRAIN";
/**文件后缀和类型对应表。*/
Loader.typeMap = { "ttf": "ttf", "png": "image", "jpg": "image", "jpeg": "image", "ktx": "image", "pvr": "image", "txt": "text", "json": "json", "prefab": "prefab", "xml": "xml", "als": "atlas", "atlas": "atlas", "mp3": "sound", "ogg": "sound", "wav": "sound", "part": "json", "fnt": "font", "plf": "plf", "plfb": "plfb", "scene": "json", "ani": "json", "sk": "arraybuffer" };
/**资源解析函数对应表，用来扩展更多类型的资源加载解析。*/
Loader.parserMap = {};
/**每帧加载完成回调使用的最大超时时间，如果超时，则下帧再处理，防止帧卡顿。*/
Loader.maxTimeOut = 100;
/**资源分组对应表。*/
Loader.groupMap = {};
/**已加载的资源池。*/
Loader.loadedMap = {};
/**已加载的图集资源池。*/
Loader.atlasMap = {};
/**已加载的纹理资源池。*/
Loader.textureMap = {};
/** @private 已加载的数据文件。*/
Loader.preLoadedMap = {};
/**@private 引用image对象，防止垃圾回收*/
Loader._imgCache = {};
/**@private */
Loader._loaders = [];
/**@private */
Loader._isWorking = false;
/**@private */
Loader._startIndex = 0;
