import { Bitmap } from "../../resource/Bitmap";
import { ILaya } from "../../../ILaya";
/**
 * @internal
 */
export class HtmlVideo extends Bitmap {
    constructor() {
        super();
        this._w = 0;
        this._h = 0;
        this._width = 1;
        this._height = 1;
        this.createDomElement();
    }
    createDomElement() {
        this._source = this.video = ILaya.Browser.createElement("video");
        var style = this.video.style;
        style.position = 'absolute';
        style.top = '0px';
        style.left = '0px';
        this.video.addEventListener("loadedmetadata", () => {
            this._w = this.video.videoWidth;
            this._h = this.video.videoHeight;
        });
    }
    setSource(url, extension) {
        while (this.video.childElementCount)
            this.video.firstChild.remove();
        if (extension & 1 /* MP4 */)
            this.appendSource(url, "video/mp4");
        if (extension & 2 /* OGG */)
            this.appendSource(url + ".ogg", "video/ogg");
    }
    appendSource(source, type) {
        var sourceElement = ILaya.Browser.createElement("source");
        sourceElement.src = source;
        sourceElement.type = type;
        this.video.appendChild(sourceElement);
    }
    getVideo() {
        return this.video;
    }
    /**
     * @internal
     * @override
     */
    _getSource() {
        // TODO Auto Generated method stub
        return this._source;
    }
    /**
     * @override
     */
    destroy() {
        super.destroy();
        var isConchApp = ILaya.Render.isConchApp;
        if (isConchApp) {
            this.video._destroy();
        }
    }
}
HtmlVideo.create = function () {
    return new HtmlVideo();
};
