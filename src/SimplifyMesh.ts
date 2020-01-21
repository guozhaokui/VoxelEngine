import { Vector3 } from "laya/d3/math/Vector3";

class SymetricMatrix {
	m: number[];

	constructor() {
		this.m = new Array(10).fill(0);
	}

	set(m11: number, m12: number, m13: number, m14: number,
		m22: number, m23: number, m24: number,
		m33: number, m34: number,
		m44: number): SymetricMatrix {
		this.m[0] = m11;
		this.m[1] = m12;
		this.m[2] = m13;
		this.m[3] = m14;

		this.m[4] = m22;
		this.m[5] = m23;
		this.m[6] = m24;

		this.m[7] = m33;
		this.m[8] = m34;

		this.m[9] = m44;
		return this;
	}
	makePlane(a: number, b: number, c: number, d: number): SymetricMatrix {
		return this.set(
			a * a, a * b, a * c, a * d,
			b * b, b * c, b * d,
			c * c, c * d,
			d * d
		);
	}

	det(a11: int, a12: int, a13: int,
		a21: int, a22: int, a23: int,
		a31: int, a32: int, a33: int): number {
		var det: number = this.m[a11] * this.m[a22] * this.m[a33]
			+ this.m[a13] * this.m[a21] * this.m[a32]
			+ this.m[a12] * this.m[a23] * this.m[a31]
			- this.m[a13] * this.m[a22] * this.m[a31]
			- this.m[a11] * this.m[a23] * this.m[a32]
			- this.m[a12] * this.m[a21] * this.m[a33];
		return det;
	}

	add(n: SymetricMatrix): SymetricMatrix {
		return new SymetricMatrix().set(
			this.m[0] + n.m[0],
			this.m[1] + n.m[1],
			this.m[2] + n.m[2],
			this.m[3] + n.m[3],

			this.m[4] + n.m[4],
			this.m[5] + n.m[5],
			this.m[6] + n.m[6],

			this.m[7] + n.m[7],
			this.m[8] + n.m[8],

			this.m[9] + n.m[9]
		);
	}

	addSelf(n: SymetricMatrix): void {
		this.m[0] += n.m[0]; this.m[1] += n.m[1]; this.m[2] += n.m[2]; this.m[3] += n.m[3];
		this.m[4] += n.m[4]; this.m[5] += n.m[5]; this.m[6] += n.m[6]; this.m[7] += n.m[7];
		this.m[8] += n.m[8]; this.m[9] += n.m[9];
	}

}

class Triangle {
	v = [0, 0, 0];// indices for array
	err = [0, 0, 0, 0];// errors
	deleted = false;
	dirty = false;
	n = new Vector3();
	candel = true;
}

class Vertex {
	p = new Vector3();
	normal = new Vector3();
	color = new Vector3();
	tstart = -1;
	tcount = -1;
	q = new SymetricMatrix();
	border = false;
	candel = true;
}

class Ref {
	tid = -1;
	tvertex = -1;
}

export class SimplifyMesh {

	triangles: Triangle[] = [];
	vertices: Vertex[] = [];
	refs: Ref[] = [];

	// 最大误差限制
	Error_MAX: number = 500000;
	Mesh_error: number = 0;

	init(vb: Float32Array, ib: Uint16Array): void {

		for (var j: int = 0, m = vb.length; j < m; j += 10) {
			var vert = new Vertex();
			vert.p.x = vb[j];
			vert.p.y = vb[j + 1];
			vert.p.z = vb[j + 2];
			vert.color.setValue(vb[j + 6], vb[j + 7], vb[j + 8]);
			this.vertices.push(vert);
		}

		var color0, color1, color2;
		for (var i: int = 0, n = ib.length; i < n; i += 3) {
			var tri = new Triangle();
			tri.v[0] = ib[i];
			tri.v[1] = ib[i + 1];
			tri.v[2] = ib[i + 2];
			this.triangles.push(tri);

			color0 = this.vertices[tri.v[0]].color;
			color1 = this.vertices[tri.v[1]].color;
			color2 = this.vertices[tri.v[2]].color;

			if (!(Vector3.equals(color0, color1) && Vector3.equals(color1, color2))) {
				this.vertices[tri.v[0]].candel = false;
				this.vertices[tri.v[1]].candel = false;
				this.vertices[tri.v[2]].candel = false;

				tri.candel = false;
			}
		}
	}

	//
	// Main simplification function
	//
	// target_count  : target nr. of triangles
	// agressiveness : sharpness to increase the threshold.
	//                 5..8 are good numbers
	//                 more iterations yield higher quality
	//
	simplify_mesh(target_count: int, agressiveness: int = 7): void {
		let Mesh_error = this.Mesh_error;
		let Error_MAX = this.Error_MAX;
		var i: int, il: int;
		for (i = 0, il = this.triangles.length; i < il; i++) {
			this.triangles[i].deleted = false;
		}

		var deleted_triangles: int = 0;
		var deleted0: boolean[] = [], deleted1: boolean[] = []; // std::vector<int>
		var triangle_count: int = this.triangles.length;

		for (var iteration: int = 0; iteration < 100; iteration++) {
			if (triangle_count - deleted_triangles <= target_count) break;
			if (Mesh_error > Error_MAX) break;

			// update mesh once in a while
			if (iteration % 5 === 0) {
				this.update_mesh(iteration);
			}
			// clear dirty flag
			for (var j: int = 0; j < this.triangles.length; j++) {
				this.triangles[j].dirty = false;
			}

			//
			// All triangles with edges below the threshold will be removed
			//
			// The following numbers works well for most models.
			// If it does not, try to adjust the 3 parameters
			//
			var threshold: Number = 0.000000001 * Math.pow(iteration + 3, agressiveness);
			// remove vertices & mark deleted triangles
			for (i = 0, il = this.triangles.length; i < il; i++) {
				var t: Triangle = this.triangles[i];
				if (t.err[3] > threshold || t.deleted || t.dirty || !t.candel) continue;

				for (j = 0; j < 3; j++) {
					if (t.err[j] < threshold) {
						var i0: int = t.v[j];
						var v0: Vertex = this.vertices[i0];

						var i1: int = t.v[(j + 1) % 3];
						var v1: Vertex = this.vertices[i1];

						var i2: int = t.v[(j + 2) % 3];
						var v2: Vertex = this.vertices[i2];

						// color check
						if (!(v0.candel && v1.candel && v2.candel)) continue;

						// Border check
						if (v0.border != v1.border) continue;

						// Compute vertex to collapse to
						var p: Vector3 = new Vector3();
						this.calculate_error(i0, i1, p);

						this.resize(deleted0, v0.tcount); // normals temporarily
						this.resize(deleted1, v1.tcount); // normals temporarily

						// dont remove if flipped
						if (this.flipped(p, i0, i1, v0, v1, deleted0)) continue;
						if (this.flipped(p, i1, i0, v1, v0, deleted1)) continue;

						// not flipped, so remove edge
						v0.p = p;
						v0.q.addSelf(v1.q);

						var tstart: int = this.refs.length;

						// CONTINUE

						deleted_triangles = this.update_triangles(i0, v0, deleted0, deleted_triangles);
						deleted_triangles = this.update_triangles(i0, v1, deleted1, deleted_triangles);

						var tcount: int = this.refs.length - tstart;

						if (tcount <= v0.tcount) {
							if (tcount)
								this.move(this.refs, v0.tstart, tstart, tcount);
						}
						else
							// append
							v0.tstart = tstart;
						v0.tcount = tcount;
						break;
					}
				}// end for j
				// done?
				if (triangle_count - deleted_triangles <= target_count)
					break;
			}
		} // end iteration

		// clean up mesh
		this.compact_mesh();
	}

	resize<T>(array: T[], count: int) {
		if (count < array.length) {
			return array.splice(count);
		}
	}

	n: Vector3 = new Vector3();
	d1: Vector3 = new Vector3();
	d2: Vector3 = new Vector3();

	flipped(p: Vector3, i0: int, i1: int, v0: Vertex, v1: Vertex, deleted: boolean[]): Boolean {
		let d1 = this.d1;
		let d2 = this.d2;
		let n = this.n;

		let refs = this.refs;
		let vertices = this.vertices;
		for (var k: int = 0; k < v0.tcount; k++) {
			var t: Triangle = this.triangles[refs[v0.tstart + k].tid];
			if (t.deleted) continue;

			var s: number = this.refs[v0.tstart + k].tvertex;
			var id1: number = t.v[(s + 1) % 3];
			var id2: number = t.v[(s + 2) % 3];

			if (id1 == i1 || id2 == i1) // delete ?
			{
				// bordercount++;
				deleted[k] = true;
				continue;
			}

			Vector3.subtract(vertices[id1].p, p, d1);
			Vector3.normalize(d1, d1);
			Vector3.subtract(vertices[id2].p, p, d2);
			Vector3.normalize(d2, d2);

			if (Math.abs(Vector3.dot(d1, d2)) > 0.999) return true;
			Vector3.cross(d1, d2, n);
			Vector3.normalize(n, n);
			deleted[k] = false;
			if (Vector3.dot(n, t.n) < 0.2) return true;
		}
		return false;
	}

	update_mesh(iteration: int) {
		let triangles = this.triangles;
		let vertices = this.vertices;
		let refs = this.refs;
		this.Mesh_error = 0;
		if (iteration > 0) {
			var dst: int = 0;
			for (var i: int = 0; i < triangles.length; i++) {
				var target: Triangle = triangles[i];
				if (!target.deleted) {
					triangles[dst++] = target;
					this.Mesh_error += target.err[3];
				}
			}
			console.log("update_mesh Mesh_error: ", this.Mesh_error)
			//            triangles.splice( dst );
			this.resize(triangles, dst);
		}

		if (iteration === 0) {
			//            for (var i: int = 0; i < vertices.length; i++ ) {
			//                // may not need to do this.
			//                vertices[i].q = new SymetricMatrix();
			//            }
			console.time('init1')
			let p1p0 = new Vector3();
			let p2p0 = new Vector3();
			for (let i: int = 0; i < triangles.length; i++) {
				var t = triangles[i];
				//TODO 效率

				let p0 = vertices[t.v[0]].p;
				let p1 = vertices[t.v[1]].p;
				let p2 = vertices[t.v[2]].p;

				Vector3.subtract(p1, p0, p1p0);
				Vector3.subtract(p2, p0, p2p0);

				let n = new Vector3();
				Vector3.cross(p1p0, p2p0, n);
				Vector3.normalize(n, n);
				t.n = n;

				var tmp = new SymetricMatrix().makePlane(n.x, n.y, n.z, -Vector3.dot(n, p0));
				for (var j: int = 0; j < 3; j++) {
					vertices[t.v[j]].q.addSelf(tmp);
				}
			}

			console.timeEnd('init1');

			for (let i: int = 0; i < triangles.length; i++) {
				// Calc Edge Error
				var t: Triangle = triangles[i];
				var pp = new Vector3();
				for (var j: int = 0; j < 3; j++) {
					t.err[j] = this.calculate_error(t.v[j], t.v[(j + 1) % 3], pp);
				}
				t.err[3] = Math.min(t.err[0], t.err[1], t.err[2]);
			}
		}

		// Init Reference ID list
		for (var i: int = 0; i < vertices.length; i++) {
			vertices[i].tstart = 0;
			vertices[i].tcount = 0;
		}
		for (var i: int = 0; i < triangles.length; i++) {
			var t = triangles[i];
			for (j = 0; j < 3; j++) vertices[t.v[j]].tcount++;
		}

		var tstart = 0;
		for (var i: int = 0; i < vertices.length; i++) {
			var v: Vertex = vertices[i];
			v.tstart = tstart;
			tstart += v.tcount;
			v.tcount = 0;
		}
		// Write References
		for (var i: int = 0; i < triangles.length * 3; i++) {
			refs[i] = new Ref();
		}
		for (var i: int = 0; i < triangles.length; i++) {
			var t = triangles[i];
			for (var j: int = 0; j < 3; j++) {
				var v: Vertex = vertices[t.v[j]];
				refs[v.tstart + v.tcount].tid = i;
				refs[v.tstart + v.tcount].tvertex = j;
				v.tcount++;
			}
		}

		// Identify boundary : vertices[].border=0,1
		if (iteration == 0) {
			//            for (var i: int = 0; i < vertices.length; i++) {
			//                vertices[i].border = 0;
			//            }

			for (var i: int = 0; i < vertices.length; i++) {
				//TODO 效率
				let vcount = [];
				let vids: number[] = [];
				for (var j = 0; j < v.tcount; j++) {
					var kk: int = refs[v.tstart + j].tid;
					var t: Triangle = triangles[kk];
					for (var k: int = 0; k < 3; k++) {
						var ofs: int = 0, id: number = t.v[k];
						while (ofs < vcount.length) {
							if (vids[ofs] == id) break;
							ofs++;
						}
						if (ofs == vcount.length) {
							vcount.push(1);
							vids.push(id);
						}
						else {
							vcount[ofs]++;
						}
					}
				}
				for (var j: int = 0; j < vcount.length; j++) {
					if (vcount[j] == 1) {
						vertices[vids[j]].border = true;
					}
				}
			}
		}
	}

	calculate_error(id_v1: int, id_v2: int, p_result: Vector3): number {
		let vertices = this.vertices;
		var vertex1: Vertex = vertices[id_v1];
		var vertex2: Vertex = vertices[id_v2];

		var q: SymetricMatrix = vertex1.q.add(vertex2.q);
		var border: Boolean = vertex1.border && vertex2.border;
		var error: number = 0;
		var det: number = q.det(0, 1, 2, 1, 4, 5, 2, 5, 7);
		if (det !== 0 && !border) {
			// q_delta is invertible
			p_result.x = -1 / det * (q.det(1, 2, 3, 4, 5, 6, 5, 7, 8));	// vx = A41/det(q_delta)
			p_result.y = 1 / det * (q.det(0, 2, 3, 1, 5, 6, 2, 7, 8));	// vy = A42/det(q_delta)
			p_result.z = -1 / det * (q.det(0, 1, 3, 1, 4, 6, 2, 5, 8));	// vz = A43/det(q_delta)
			error = this.vertex_error(q, p_result.x, p_result.y, p_result.z);
		}
		else {
			var p1 = vertex1.p;
			var p2 = vertex2.p;
			var p3 = new Vector3();
			Vector3.add(p1, p2, p3);
			Vector3.scale(p3, 0.5, p3);
			var error1: number = this.vertex_error(q, p1.x, p1.y, p1.z);
			var error2: number = this.vertex_error(q, p2.x, p2.y, p2.z);
			var error3: number = this.vertex_error(q, p3.x, p3.y, p3.z);
			error = Math.min(error1, error2, error3);
			if (error1 === error) {
				p1.cloneTo(p_result);
			}
			if (error2 === error) {
				p2.cloneTo(p_result);
			}
			if (error3 === error) {
				p3.cloneTo(p_result);
			}
		}
		return error;
	}

	update_triangles(i0: int, v: Vertex, deleted: boolean[], deleted_triangles: int): int {
		let refs = this.refs;
		let triangles = this.triangles;
		var p: Vector3 = new Vector3();
		for (var k: int = 0; k < v.tcount; k++) {
			var r: Ref = refs[v.tstart + k];
			var t: Triangle = triangles[r.tid];
			if (t.deleted) continue;
			if (deleted[k]) {
				t.deleted = true;
				deleted_triangles++;
				continue;
			}
			t.v[r.tvertex] = i0;
			t.dirty = true;

			t.err[0] = this.calculate_error(t.v[0], t.v[1], p);
			t.err[1] = this.calculate_error(t.v[1], t.v[2], p);
			t.err[2] = this.calculate_error(t.v[2], t.v[0], p);
			t.err[3] = Math.min(t.err[0], t.err[1], t.err[2]);
			refs.push(r);
		}
		return deleted_triangles;
	}

	compact_mesh(): void {
		let vertices = this.vertices;
		let triangles = this.triangles;
		var dst: int = 0;
		for (var i = 0; i < vertices.length; i++) {
			vertices[i].tcount = 0;
		}
		for (var i = 0; i < triangles.length; i++) {
			if (!triangles[i].deleted) {
				var t: Triangle = triangles[i];
				triangles[dst++] = t;
				for (var j = 0; j < 3; j++)
					vertices[t.v[j]].tcount = 1;
			}
		}
		this.resize(triangles, dst);
		dst = 0;
		for (var i = 0; i < vertices.length; i++) {
			if (vertices[i].tcount) {
				vertices[i].tstart = dst;
				vertices[dst].p = vertices[i].p;
				vertices[dst].color = vertices[i].color;
				vertices[dst].candel = vertices[i].candel;
				dst++;
			}
		}
		for (var i = 0; i < triangles.length; i++) {
			var t: Triangle = triangles[i];
			for (var j = 0; j < 3; j++)
				t.v[j] = vertices[t.v[j]].tstart;
		}
		this.resize(vertices, dst);
	}

	vertex_error(q: SymetricMatrix, x: number, y: number, z: number): number {
		return q.m[0] * x * x + 2 * q.m[1] * x * y + 2 * q.m[2] * x * z + 2 * q.m[3] * x + q.m[4] * y * y + 2 * q.m[5] * y * z + 2 * q.m[6] * y + q.m[7] * z * z + 2 * q.m[8] * z + q.m[9];
	}

	move<T>(refs: T[], dest: int, source: int, count: int): void {
		for (var i: int = 0; i < count; i++) {
			refs[dest + i] = refs[source + i];
		}
	}

	calThinNormal(): void {
		let triangles = this.triangles;
		let vertices = this.vertices;
		for (var i: int = 0; i < triangles.length; i++) {
			var t: Triangle = triangles[i];
			for (var j: int = 0; j < 3; j++) {
				var v: Vertex = vertices[t.v[j]];
				Vector3.add(v.normal, t.n, v.normal);
				Vector3.normalize(v.normal, v.normal);
			}
		}
	}

	calNormal(): void {
		var p1p0: Vector3 = new Vector3();
		var p2p0: Vector3 = new Vector3();
		let triangles = this.triangles;
		let vertices = this.vertices;

		for (var i: int = 0; i < triangles.length; i++) {
			var t: Triangle = this.triangles[i];
			var p0: Vector3 = vertices[t.v[0]].p;
			var p1: Vector3 = vertices[t.v[1]].p;
			var p2: Vector3 = vertices[t.v[2]].p;

			Vector3.subtract(p1, p0, p1p0);
			Vector3.subtract(p2, p0, p2p0);

			Vector3.cross(p1p0, p2p0, t.n);
			Vector3.normalize(t.n, t.n);
		}
	}

	private buildVertexBuffer(vertexBuffer: Float32Array, pos: int, t: Triangle): int {
		let vertices = this.vertices;
		for (var i: int = 0; i < 3; i++) {
			var v: Vertex = vertices[t.v[i]];
			vertexBuffer[pos++] = v.p.x;
			vertexBuffer[pos++] = v.p.y;
			vertexBuffer[pos++] = v.p.z;

			//                vertexBuffer[pos++] = -v.normal.x;
			//                vertexBuffer[pos++] = -v.normal.y;
			//                vertexBuffer[pos++] = -v.normal.z;

			vertexBuffer[pos++] = -t.n.x;
			vertexBuffer[pos++] = -t.n.y;
			vertexBuffer[pos++] = -t.n.z;

			vertexBuffer[pos++] = v.color.x;
			vertexBuffer[pos++] = v.color.y;
			vertexBuffer[pos++] = v.color.z;
			vertexBuffer[pos++] = 1.0;
		}
		return pos;
	}

	genMesh() {
		let triangles = this.triangles;
		this.calNormal();
		var indexLength: int = triangles.length;
		var indexBuffer: Uint16Array = new Uint16Array(indexLength * 3);
		var t: Triangle;

		var vertexBuffer: Float32Array = new Float32Array(indexLength * 3 * 10);
		var pos: int = 0;
		for (var i: int = 0; i < triangles.length; i++) {
			t = triangles[i];
			indexBuffer[3 * i + 0] = 3 * i + 0;
			indexBuffer[3 * i + 1] = 3 * i + 1;
			indexBuffer[3 * i + 2] = 3 * i + 2;

			pos = this.buildVertexBuffer(vertexBuffer, pos, t);
		}

		console.log("Mesh_error: ", this.Mesh_error);
		console.log("index length: ", indexBuffer.length);

		//return PrimitiveMesh._createMesh(vertexDeclaration, vertexBuffer, indexBuffer);
		var obj = { vb: vertexBuffer, ib: indexBuffer };
		this.triangles = [];
		this.vertices = [];
		this.refs = [];
		this.Mesh_error = 0;
		return obj;
	}

	genThinMesh(): Object {
		let triangles = this.triangles;
		let vertices = this.vertices;
		this.calNormal();
		this.calThinNormal();
		var indexmap = [];
		var triCount: int = triangles.length;
		var ib: Uint16Array = new Uint16Array(triCount * 3);
		var vbpos: int = 0;
		var vba = [];
		for (var i: int = 0; i < triCount; i++) {
			var t: Triangle = triangles[i];
			for (var j: int = 0; j < 3; j++) {
				var verindex: int = t.v[j];
				if (!indexmap[verindex]) {
					ib[i * 3 + j] = vbpos;
					indexmap[verindex] = vbpos++;
					vba.push(vertices[verindex]);
				}
				else {
					ib[3 * i + j] = indexmap[verindex];
				}
			}
		}

		var vb: Float32Array = new Float32Array(vba.length * 10);
		for (var i: int = 0; i < vba.length; i++) {
			var v: Vertex = vba[i];
			vb[i * 10 + 0] = v.p.x;
			vb[i * 10 + 1] = v.p.y;
			vb[i * 10 + 2] = v.p.z;

			vb[i * 10 + 3] = -v.normal.x;
			vb[i * 10 + 4] = -v.normal.y;
			vb[i * 10 + 5] = -v.normal.z;

			vb[i * 10 + 6] = v.color.x;
			vb[i * 10 + 7] = v.color.y;
			vb[i * 10 + 8] = v.color.z;
			vb[i * 10 + 9] = 1.0;
		}

		var obj = [];
		obj[0] = vb;
		obj[1] = ib;
		triangles = [];
		vertices = [];
		this.refs = [];
		return obj;
	}
}
