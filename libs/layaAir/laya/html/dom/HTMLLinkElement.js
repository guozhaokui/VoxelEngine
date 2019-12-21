import { HTMLElement } from "./HTMLElement";
import { Loader } from "../../net/Loader";
import { Event } from "../../events/Event";
import { HTMLStyle } from "../utils/HTMLStyle";
import { URL } from "../../net/URL";
import { ILaya } from "../../../ILaya";
import { ClassUtils } from "../../utils/ClassUtils";
/**
 * @private
 */
export class HTMLLinkElement extends HTMLElement {
    /**
     * @override
     */
    _creates() {
    }
    /**
     *
     * @param graphic
     * @param gX
     * @param gY
     * @param recList
     * @override
     */
    drawToGraphic(graphic, gX, gY, recList) {
    }
    /**
     * @override
     */
    reset() {
        if (this._loader)
            this._loader.off(Event.COMPLETE, this, this._onload);
        this._loader = null;
        return this;
    }
    /**@internal */
    _onload(data) {
        if (this._loader)
            this._loader = null;
        switch (this.type) {
            case 'text/css':
                HTMLStyle.parseCSS(data, this.URI);
                break;
        }
        this.repaint(true);
    }
    /**
     * @override
     */
    set href(url) {
        if (!url)
            return;
        url = this.formatURL(url);
        this.URI = new URL(url);
        if (this._loader)
            this._loader.off(Event.COMPLETE, this, this._onload);
        if (Loader.getRes(url)) {
            if (this.type == "text/css") {
                HTMLStyle.parseCSS(Loader.getRes(url), this.URI);
            }
            return;
        }
        this._loader = new Loader();
        this._loader.once(Event.COMPLETE, this, this._onload);
        this._loader.load(url, Loader.TEXT);
    }
    get href() {
        return super.href;
    }
}
HTMLLinkElement._cuttingStyle = new RegExp("((@keyframes[\\s\\t]+|)(.+))[\\t\\n\\r\\\s]*{", "g");
ILaya.regClass(HTMLLinkElement);
ClassUtils.regClass("laya.html.dom.HTMLLinkElement", HTMLLinkElement);
ClassUtils.regClass("Laya.HTMLLinkElement", HTMLLinkElement);
