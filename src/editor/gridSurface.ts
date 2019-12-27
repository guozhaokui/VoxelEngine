import { Mesh } from "laya/d3/resource/models/Mesh";
import { Vector3 } from "laya/d3/math/Vector3";
import { Quaternion } from "laya/d3/math/Quaternion";
import { PixelLineSprite3D } from "laya/d3/core/pixelLine/PixelLineSprite3D";
import { Scene3D } from "laya/d3/core/scene/Scene3D";
import { Color } from "laya/d3/math/Color";
import { PixelLineMaterial } from "laya/d3/core/pixelLine/PixelLineMaterial";
import { Material } from "laya/d3/core/material/Material";
import { RenderState } from "laya/d3/core/material/RenderState";

export class GridSurface {
	private grid = new PixelLineSprite3D(32 * 1024);
	private dyna = new PixelLineSprite3D(8 * 1024);
	public showAxis = true;
	private gridw = 10;
	constructor(gridw: number, pos: Vector3 | null, quat: Quaternion | null) {
		this.gridw = gridw;
		let grid = this.grid;
		if (pos) grid.transform.position = pos;
		if (quat) grid.transform.rotation = quat;
	}

	private build() {
		let xnum = 200;
		let ynum = 200;
		let gridw = this.gridw;
		let minx = -xnum * gridw;
		let miny = -ynum * gridw;
		let maxx = xnum * gridw;
		let maxy = ynum * gridw;

		let xcolor = new Color(1, 0, 0, 0.8);
		let ycolor = new Color(0, 1, 0, 0.8);
		let zcolor = new Color(0, 0, 1, 0.8);
		let color = new Color(0.5, 0.5, 0.5, 0.5);

		let grid = this.grid;
		for (let x = 0; x < xnum; x++) {
			grid.addLine(new Vector3(gridw * x, 0, miny), new Vector3(gridw * x, 0, maxy), color, color);
			grid.addLine(new Vector3(-gridw * x, 0, miny), new Vector3(-gridw * x, 0, maxy), color, color);
		}

		for (let y = 0; y < ynum; y++) {
			grid.addLine(new Vector3(minx, 0, gridw * y), new Vector3(maxx, 0, gridw * y), color, color);
			grid.addLine(new Vector3(minx, 0, -gridw * y), new Vector3(maxx, 0, -gridw * y), color, color);
		}

		if (this.showAxis) {
			grid.addLine(new Vector3(minx, 0, 0), new Vector3(maxx, 0, 0), xcolor, xcolor);
			grid.addLine(new Vector3(0, miny, 0), new Vector3(0, maxy, 0), ycolor, ycolor);
			grid.addLine(new Vector3(0, 0, minx), new Vector3(0, 0, maxx), zcolor, zcolor);
		}

		var lineMaterial = new PixelLineMaterial();
		lineMaterial.renderQueue = Material.RENDERQUEUE_TRANSPARENT;
		lineMaterial.alphaTest = false;
		lineMaterial.depthWrite = false;
		lineMaterial.cull = RenderState.CULL_BACK;
		lineMaterial.blend = RenderState.BLEND_ENABLE_ALL;
		lineMaterial.blendSrc = RenderState.BLENDPARAM_SRC_ALPHA;
		lineMaterial.blendDst = RenderState.BLENDPARAM_ONE_MINUS_SRC_ALPHA;
		lineMaterial.depthTest = RenderState.DEPTHTEST_LESS;
		grid.pixelLineRenderer.sharedMaterial = lineMaterial;

	}

	addToScene(sce: Scene3D) {
		this.build();
		sce.addChild(this.grid);
		sce.addChild(this.dyna);
	}

	/**
	 * 把碰撞点用横纵坐标显示出来
	 */
	showHitPoint() {

	}
}