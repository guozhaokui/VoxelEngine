import { Matrix } from "../maths/Matrix";
import { Point } from "../maths/Point";
import { Rectangle } from "../maths/Rectangle";
import { RenderTexture2D } from "../resource/RenderTexture2D";
import { WebGLRTMgr } from "../resource/WebGLRTMgr";
import { BlendMode } from "../webgl/canvas/BlendMode";
import { ShaderDefines2D } from "../webgl/shader/d2/ShaderDefines2D";
import { Value2D } from "../webgl/shader/d2/value/Value2D";
import { SubmitCMD } from "../webgl/submit/SubmitCMD";
/**
 * <code>Filter</code> 是滤镜基类。
 */
export class Filter {
    /**
     * 创建一个 <code>Filter</code> 实例。
     * */
    constructor() {
    }
    /**@private 滤镜类型。*/
    get type() { return -1; }
}
/**@private 模糊滤镜。*/
Filter.BLUR = 0x10;
/**@private 颜色滤镜。*/
Filter.COLOR = 0x20;
/**@private 发光滤镜。*/
Filter.GLOW = 0x08;
Filter._filter = function (sprite, context, x, y) {
    var webglctx = context;
    var next = this._next;
    if (next) {
        var filters = sprite.filters, len = filters.length;
        //如果只有一个滤镜，那么还用原来的方式
        if (len == 1 && (filters[0].type == Filter.COLOR)) {
            context.save();
            context.setColorFilter(filters[0]);
            next._fun.call(next, sprite, context, x, y);
            context.restore();
            return;
        }
        //思路：依次遍历滤镜，每次滤镜都画到out的RenderTarget上，然后把out画取src的RenderTarget做原图，去叠加新的滤镜
        var svCP = Value2D.create(ShaderDefines2D.TEXTURE2D, 0); //拷贝用shaderValue
        var b;
        var p = Point.TEMP;
        var tMatrix = webglctx._curMat;
        var mat = Matrix.create();
        tMatrix.copyTo(mat);
        var tPadding = 0; //给glow用
        var tHalfPadding = 0;
        var tIsHaveGlowFilter = false;
        //这里判断是否存储了out，如果存储了直接用;
        var source = null;
        var out = sprite._cacheStyle.filterCache || null;
        if (!out || sprite.getRepaint() != 0) {
            tIsHaveGlowFilter = sprite._isHaveGlowFilter();
            //glow需要扩展边缘
            if (tIsHaveGlowFilter) {
                tPadding = 50;
                tHalfPadding = 25;
            }
            b = new Rectangle();
            b.copyFrom(sprite.getSelfBounds());
            b.x += sprite.x;
            b.y += sprite.y;
            b.x -= sprite.pivotX + 4; //blur 
            b.y -= sprite.pivotY + 4; //blur
            var tSX = b.x;
            var tSY = b.y;
            //重新计算宽和高
            b.width += (tPadding + 8); //增加宽度 blur  由于blur系数为9
            b.height += (tPadding + 8); //增加高度 blur
            p.x = b.x * mat.a + b.y * mat.c;
            p.y = b.y * mat.d + b.x * mat.b;
            b.x = p.x;
            b.y = p.y;
            p.x = b.width * mat.a + b.height * mat.c;
            p.y = b.height * mat.d + b.width * mat.b;
            b.width = p.x;
            b.height = p.y;
            if (b.width <= 0 || b.height <= 0) {
                return;
            }
            out && WebGLRTMgr.releaseRT(out); // out.recycle();
            source = WebGLRTMgr.getRT(b.width, b.height);
            var outRT = out = WebGLRTMgr.getRT(b.width, b.height);
            sprite._getCacheStyle().filterCache = out;
            //使用RT
            webglctx.pushRT();
            webglctx.useRT(source);
            var tX = sprite.x - tSX + tHalfPadding;
            var tY = sprite.y - tSY + tHalfPadding;
            //执行节点的渲染
            next._fun.call(next, sprite, context, tX, tY);
            webglctx.useRT(outRT);
            for (var i = 0; i < len; i++) {
                if (i != 0) {
                    //把out往src上画。这只是一个拷贝的过程，下面draw(src) to outRT 才是真正的应用filter
                    //由于是延迟执行，不能直接在这里swap。 TODO 改成延迟swap
                    webglctx.useRT(source);
                    webglctx.drawTarget(outRT, 0, 0, b.width, b.height, Matrix.TEMP.identity(), svCP, null, BlendMode.TOINT.overlay);
                    webglctx.useRT(outRT);
                }
                var fil = filters[i];
                //把src往out上画
                switch (fil.type) {
                    case Filter.BLUR:
                        fil._glRender && fil._glRender.render(source, context, b.width, b.height, fil);
                        //BlurFilterGLRender.render(source, context, b.width, b.height, fil as BlurFilter);
                        break;
                    case Filter.GLOW:
                        //GlowFilterGLRender.render(source, context, b.width, b.height, fil as GlowFilter);
                        fil._glRender && fil._glRender.render(source, context, b.width, b.height, fil);
                        break;
                    case Filter.COLOR:
                        webglctx.setColorFilter(fil);
                        webglctx.drawTarget(source, 0, 0, b.width, b.height, Matrix.EMPTY.identity(), Value2D.create(ShaderDefines2D.TEXTURE2D, 0));
                        webglctx.setColorFilter(null);
                        break;
                }
            }
            webglctx.popRT();
        }
        else {
            tIsHaveGlowFilter = sprite._cacheStyle.hasGlowFilter || false;
            if (tIsHaveGlowFilter) {
                tPadding = 50;
                tHalfPadding = 25;
            }
            b = sprite.getBounds();
            if (b.width <= 0 || b.height <= 0) {
                return;
            }
            b.width += tPadding;
            b.height += tPadding;
            p.x = b.x * mat.a + b.y * mat.c;
            p.y = b.y * mat.d + b.x * mat.b;
            b.x = p.x;
            b.y = p.y;
            p.x = b.width * mat.a + b.height * mat.c;
            p.y = b.height * mat.d + b.width * mat.b;
            b.width = p.x;
            b.height = p.y;
            //scope.addValue("out", out);
        }
        x = x - tHalfPadding - sprite.x;
        y = y - tHalfPadding - sprite.y;
        p.setTo(x, y);
        mat.transformPoint(p);
        x = p.x + b.x;
        y = p.y + b.y;
        //把最后的out纹理画出来
        webglctx._drawRenderTexture(out, x, y, b.width, b.height, Matrix.TEMP.identity(), 1.0, RenderTexture2D.defuv);
        //把对象放回池子中
        //var submit:SubmitCMD = SubmitCMD.create([scope], Filter._recycleScope, this);
        if (source) {
            var submit = SubmitCMD.create([source], function (s) {
                s.destroy();
            }, this);
            source = null;
            context.addRenderObject(submit);
        }
        mat.destroy();
    }
};
