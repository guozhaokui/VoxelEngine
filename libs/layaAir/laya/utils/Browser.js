import { ILaya } from "../../ILaya";
/**
 * <code>Browser</code> 是浏览器代理类。封装浏览器及原生 js 提供的一些功能。
 */
export class Browser {
    /**@internal */
    static __init__() {
        var Laya = window.Laya || ILaya.Laya;
        if (Browser._window)
            return Browser._window;
        var win = Browser._window = window;
        var doc = Browser._document = win.document;
        var u = Browser.userAgent = win.navigator.userAgent;
        var maxTouchPoints = win.navigator.maxTouchPoints || 0;
        var platform = win.navigator.platform;
        //阿里小游戏
        if (u.indexOf('AlipayMiniGame') > -1 && "my" in Browser.window) {
            //这里需要手动初始化阿里适配库
            window.aliPayMiniGame(Laya, Laya);
            if (!Laya["ALIMiniAdapter"]) {
                console.error("请先添加阿里小游戏适配库");
                //TODO 教程要改
            }
            else {
                Laya["ALIMiniAdapter"].enable();
            }
        }
        if (u.indexOf('OPPO') == -1 && u.indexOf("MiniGame") > -1 && "wx" in Browser.window) {
            if ("qq" in Browser.window) {
                //手机QQ小游戏
                window.qqMiniGame(Laya, Laya);
                if (!Laya["QQMiniAdapter"]) {
                    console.error("请引入手机QQ小游戏的适配库：https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-0");
                }
                else {
                    Laya["QQMiniAdapter"].enable();
                }
            }
            else {
                //微信小游戏
                window.wxMiniGame(Laya, Laya);
                if (!Laya["MiniAdpter"]) {
                    console.error("请先添加小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-0");
                    //TODO 教程要改
                }
                else {
                    Laya["MiniAdpter"].enable();
                }
            }
        }
        //QQ小游戏
        if (u.indexOf("MiniGame") > -1 && "qq" in Browser.window) {
            window.qqMiniGame(Laya, Laya);
            if (!Laya["QQMiniAdapter"]) {
                console.error("请先添加小游戏适配库,详细教程");
            }
            else {
                Laya["QQMiniAdapter"].enable();
            }
        }
        //百度小游戏
        if (u.indexOf("SwanGame") > -1) {
            window.bdMiniGame(Laya, Laya);
            if (!Laya["BMiniAdapter"]) {
                console.error("请先添加百度小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-0");
                //TODO 教程要改
            }
            else {
                Laya["BMiniAdapter"].enable();
            }
        }
        //小米小游戏
        if (u.indexOf('QuickGame') > -1) {
            window.miMiniGame(Laya, Laya);
            if (!Laya["KGMiniAdapter"]) {
                console.error("请先添加小米小游戏适配库,详细教程：https://ldc2.layabox.com/doc/?nav=zh-ts-5-0-0");
                //TODO 教程要改
            }
            else {
                Laya["KGMiniAdapter"].enable();
            }
        }
        //OPPO小游戏
        if (u.indexOf('OPPO') > -1 && u.indexOf('MiniGame') > -1) {
            window.qgMiniGame(Laya, Laya);
            if (!Laya["QGMiniAdapter"]) {
                console.error("请先添加OPPO小游戏适配库");
                //TODO 教程要改
            }
            else {
                Laya["QGMiniAdapter"].enable();
            }
        }
        //VIVO小游戏
        if (u.indexOf('VVGame') > -1) {
            window.vvMiniGame(Laya, Laya);
            if (!Laya["VVMiniAdapter"]) {
                console.error("请先添加VIVO小游戏适配库");
                //TODO 教程要改
            }
            else {
                Laya["VVMiniAdapter"].enable();
            }
        }
        //新增trace的支持
        win.trace = console.log;
        //兼容requestAnimationFrame
        win.requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (fun) {
            return win.setTimeout(fun, 1000 / 60);
        };
        //强制修改body样式
        var bodyStyle = doc.body.style;
        bodyStyle.margin = 0;
        bodyStyle.overflow = 'hidden';
        bodyStyle['-webkit-user-select'] = 'none';
        bodyStyle['-webkit-tap-highlight-color'] = 'rgba(200,200,200,0)';
        //强制修改meta标签，防止开发者写错
        var metas = doc.getElementsByTagName('meta');
        var i = 0, flag = false, content = 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no';
        while (i < metas.length) {
            var meta = metas[i];
            if (meta.name == 'viewport') {
                meta.content = content;
                flag = true;
                break;
            }
            i++;
        }
        if (!flag) {
            meta = doc.createElement('meta');
            meta.name = 'viewport', meta.content = content;
            doc.getElementsByTagName('head')[0].appendChild(meta);
        }
        //处理兼容性			
        Browser.onMobile = window.isConchApp ? true : u.indexOf("Mobile") > -1;
        Browser.onIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        Browser.onIPhone = u.indexOf("iPhone") > -1;
        Browser.onMac = u.indexOf("Mac OS X") > -1;
        Browser.onIPad = u.indexOf("iPad") > -1 || (platform === 'MacIntel' && maxTouchPoints > 1); //"platform === 'MacIntel' && maxTouchPoints >1" is a temporary solution，maybe accidentally injure other platform.
        Browser.onAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        Browser.onWP = u.indexOf("Windows Phone") > -1;
        Browser.onQQBrowser = u.indexOf("QQBrowser") > -1;
        Browser.onMQQBrowser = u.indexOf("MQQBrowser") > -1 || (u.indexOf("Mobile") > -1 && u.indexOf("QQ") > -1);
        Browser.onIE = !!win.ActiveXObject || "ActiveXObject" in win;
        Browser.onWeiXin = u.indexOf('MicroMessenger') > -1;
        Browser.onSafari = u.indexOf("Safari") > -1;
        Browser.onPC = !Browser.onMobile;
        Browser.onMiniGame = u.indexOf('MiniGame') > -1;
        Browser.onBDMiniGame = u.indexOf('SwanGame') > -1;
        Browser.onLayaRuntime = !!Browser.window.conch;
        if (u.indexOf('OPPO') > -1 && u.indexOf('MiniGame') > -1) {
            Browser.onQGMiniGame = true; //OPPO环境判断
            Browser.onMiniGame = false;
        }
        else if ("qq" in Browser.window && u.indexOf('MiniGame') > -1) {
            Browser.onQQMiniGame = true; //手机QQ环境判断
            Browser.onMiniGame = false;
        }
        Browser.onVVMiniGame = u.indexOf('VVGame') > -1; //vivo
        Browser.onKGMiniGame = u.indexOf('QuickGame') > -1; //小米运行环境判断
        if (u.indexOf('AlipayMiniGame') > -1) {
            Browser.onAlipayMiniGame = true; //阿里小游戏环境判断
            Browser.onMiniGame = false;
        }
        return win;
    }
    /**
     * 创建浏览器原生节点。
     * @param	type 节点类型。
     * @return	创建的节点对象的引用。
     */
    static createElement(type) {
        Browser.__init__();
        return Browser._document.createElement(type);
    }
    /**
     * 返回 Document 对象中拥有指定 id 的第一个对象的引用。
     * @param	type 节点id。
     * @return	节点对象。
     */
    static getElementById(type) {
        Browser.__init__();
        return Browser._document.getElementById(type);
    }
    /**
     * 移除指定的浏览器原生节点对象。
     * @param	type 节点对象。
     */
    static removeElement(ele) {
        if (ele && ele.parentNode)
            ele.parentNode.removeChild(ele);
    }
    /**
     * 获取浏览器当前时间戳，单位为毫秒。
     */
    static now() {
        return Date.now();
        ;
    }
    /**
     * 浏览器窗口可视宽度。
     * 通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerWidth(包含滚动条宽度) > document.body.clientWidth(不包含滚动条宽度)，如果前者为0或为空，则选择后者。
     */
    static get clientWidth() {
        Browser.__init__();
        return Browser._window.innerWidth || Browser._document.body.clientWidth;
    }
    /**
     * 浏览器窗口可视高度。
     * 通过分析浏览器信息获得。浏览器多个属性值优先级为：window.innerHeight(包含滚动条高度) > document.body.clientHeight(不包含滚动条高度) > document.documentElement.clientHeight(不包含滚动条高度)，如果前者为0或为空，则选择后者。
     */
    static get clientHeight() {
        Browser.__init__();
        return Browser._window.innerHeight || Browser._document.body.clientHeight || Browser._document.documentElement.clientHeight;
    }
    /** 浏览器窗口物理宽度。考虑了设备像素比。*/
    static get width() {
        Browser.__init__();
        return ((ILaya.stage && ILaya.stage.canvasRotation) ? Browser.clientHeight : Browser.clientWidth) * Browser.pixelRatio;
    }
    /** 浏览器窗口物理高度。考虑了设备像素比。*/
    static get height() {
        Browser.__init__();
        return ((ILaya.stage && ILaya.stage.canvasRotation) ? Browser.clientWidth : Browser.clientHeight) * Browser.pixelRatio;
    }
    /** 获得设备像素比。*/
    static get pixelRatio() {
        if (Browser._pixelRatio < 0) {
            Browser.__init__();
            if (Browser.userAgent.indexOf("Mozilla/6.0(Linux; Android 6.0; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10)") > -1)
                Browser._pixelRatio = 2;
            else {
                Browser._pixelRatio = (Browser._window.devicePixelRatio || 1);
                if (Browser._pixelRatio < 1)
                    Browser._pixelRatio = 1;
            }
        }
        return Browser._pixelRatio;
    }
    /**画布容器，用来盛放画布的容器。方便对画布进行控制*/
    static get container() {
        if (!Browser._container) {
            Browser.__init__();
            Browser._container = Browser.createElement("div");
            Browser._container.id = "layaContainer";
            Browser._document.body.appendChild(Browser._container);
        }
        return Browser._container;
    }
    static set container(value) {
        Browser._container = value;
    }
    /**浏览器原生 window 对象的引用。*/
    static get window() {
        return Browser._window || Browser.__init__();
    }
    /**浏览器原生 document 对象的引用。*/
    static get document() {
        Browser.__init__();
        return Browser._document;
    }
}
/** @private */
Browser._pixelRatio = -1;
/** @private */
Browser.mainCanvas = null;
/**@private */
Browser.hanzi = new RegExp("^[\u4E00-\u9FA5]$");
/**@private */
Browser.fontMap = [];
/**@private */
Browser.measureText = function (txt, font) {
    var isChinese = Browser.hanzi.test(txt);
    if (isChinese && Browser.fontMap[font]) {
        return Browser.fontMap[font];
    }
    var ctx = Browser.context;
    ctx.font = font;
    var r = ctx.measureText(txt);
    if (isChinese)
        Browser.fontMap[font] = r;
    return r;
};
