import { Vector3 } from "laya/d3/math/Vector3";

function pixelArtLine(x1: int, y1: int, x2: int, y2: int) {
	x1 = Math.round(x1);
	y1 = Math.round(y1);
	x2 = Math.round(x2);
	y2 = Math.round(y2);
	const dx = Math.abs(x2 - x1);
	const sx = x1 < x2 ? 1 : -1;
	const dy = -Math.abs(y2 - y1);
	const sy = y1 < y2 ? 1 : -1;
	var e2, er = dx + dy, end = false;
	while (!end) {
		//ctx.rect(x1, y1, 1, 1);
		if (x1 === x2 && y1 === y2) {
			end = true;
		} else {
			e2 = 2 * er;
			if (e2 > dy) {
				er += dy;
				x1 += sx;
			}
			if (e2 < dx) {
				er += dx;
				y1 += sy;
			}
		}
	}
};

interface callback {
	(): void;
}

function processScanLine(y:int, va:int[], vb:int[], vc:int[], vd:int[]){
}

/**
 */
function fill_2d(v0: int[], v1: int[], v2: int[]): void {
	// 三个点按照2d的y轴排序，下面相当于是展开的冒泡排序,p0的y最小
	var temp;
	if (v0[1] > v1[1]) {
		temp = v1; v1 = v0; v0 = temp;
	}

	if (v1[1] > v2[1]) {
		temp = v1; v1 = v2; v2 = temp;
	}

	if (v0[1] > v1[1]) {
		temp = v1; v1 = v0; v0 = temp;
	}

	var y: int = 0;
	var turnDir: number = (v1[0] - v0[0]) * (v2[1] - v0[1]) - (v2[0] - v0[0]) * (v1[1] - v0[1]);
	if (turnDir == 0) {	// 同一条线上
		let dx = v2[0] - v0[0];
		let dy = v2[1] - v0[1];
		let dz = v2[2] - v0[2];
		if (dy == 0) {
			//this.fillCB(v0[0],v0[1],v0[2],0,0); //TODO 临时，给物理不关心uv
		} else {
			//yzx x是y，y是z，z是x
			for (y = v0[1]; y <= v2[1]; y++) {
				let k = (y - v0[1]) / dy;
				let cx = v0[0] + (k * dx) | 0;
				let cz = v0[2] + (k * dz) | 0;
				//this.fillCB(cz, cx, y, 0, 0);//TODO 
			}
		}
	} else if (turnDir > 0) {// >0 则v0-v2在v0-v1的右边，即向右拐
		// v0
		// -
		// -- 
		// - -
		// -  -
		// -   - v1
		// -  -
		// - -
		// -
		// v2
		for (y = v0[1]; y <= v2[1]; y++) {
			// y分成两部分处理
			if (y < v1[1]) {
				// 上半部分。 v0-v2 扫描到 v0-v1
				processScanLine(y,v0, v2, v0, v1);
			}
			else {
				processScanLine(y, v0, v2, v1, v2, );
			}
		}
	} else {	// 否则，左拐
		//       v0
		//        -
		//       -- 
		//      - -
		//     -  -
		// v1 -   - 
		//     -  -
		//      - -
		//        -
		//       v2
		for (y = v0[1]; y <= v2[1]; y++) {
			if (y < v1[1]) {
				processScanLine(y, v0, v1, v0, v2);
			}
			else {
				processScanLine(y, v1, v2, v0, v2);
			}
		}
	}
}

/**
 * 
 * xa,ya--xb,yb,  xc,yc--xd,yd
 */
function fillQuat2D(xa: int, ya: int, xb: int, yb: int, xc: int, yc: int, xd: int, yd: int) {

}

function fillTri2D(ax: int, ay: int, bx: int, by: int, cx: int, cy: int) {

}

function triToVoxel(v0: Vector3, v1: Vector3, v2: Vector3, cellsize: number, cb: callback) {
	// 用y轴(xz平面)切割
	// 一个平面与切割区间相交形成的投影可能是点，线段，三角形，四边形。
	let ymin = Math.min(v0.y, v1.y, v2.y);
	let ymax = Math.max(v0.y, v1.y, v2.y);

	let maxny = Math.floor(ymax / cellsize);
	let minny = Math.floor(ymin / cellsize);
	if (minny == maxny) {
		// 在同一平面内，直接2d三角形填充就行了
	} else {
		for (let y = minny; y <= maxny; y++) {

		}
	}
}

