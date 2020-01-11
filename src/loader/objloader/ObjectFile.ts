/**
 * https://en.wikipedia.org/wiki/Wavefront_.obj_file
 * http://paulbourke.net/dataformats/mtl/
 * https://github.com/frenchtoast747/webgl-obj-loader
 */

export class OBJLoader_Material {
    name: string;
    ambient = [0, 0, 0]; // Ka - Ambient Reflectivity
    diffuse = [0, 0, 0]; // Kd - Defuse Reflectivity
    specular = [0, 0, 0];// Ks
    emissive = [0, 0, 0];// Ke
    transmissionFilter = [0, 0, 0];// Tf
    dissolve = 0;// d
    specularExponent = 0;// valid range is between 0 and 1000
    transparency = 0;// either d or Tr; valid values are normalized
    illumination = 0;// illum - the enum of the illumination model to use
    refractionIndex = 1;// Ni - Set to "normal" (air).
    sharpness = 0;// sharpness
    mapDiffuse:{filename:string}|null = null;// map_Kd
    mapAmbient = null;// map_Ka
    mapSpecular = null;// map_Ks
    mapSpecularExponent = null;// map_Ns
    mapDissolve = null;// map_d
    antiAliasing = false;// map_aat
    mapBump = null;// map_bump or bump
    mapDisplacement = null;// disp
    mapDecal = null;// decal
    mapEmissive = null;// map_Ke
    // refl - when the reflection type is a cube, there will be multiple refl
    //        statements for each side of the cube. If it's a spherical
    //        reflection, there should only ever be one.
    mapReflections = [];
    currentMaterial :OBJLoader_Material;
    materials: {[key:string]:OBJLoader_Material} = {};		// 

    /**
     * Constructor
     * @param {String} name the unique name of the material
     */
    constructor(name:string){
        this.name = name;
    }

    parse_newmtl(tokens: string[]): void {
        var name = tokens[0];
        this.currentMaterial = this.materials[name] = new OBJLoader_Material(name);
    }

    parseColor(tokens:string[]) {
        if (tokens[0] == "spectral") {
            console.error(
                "The MTL parser does not support spectral curve files. You will " +
                "need to convert the MTL colors to either RGB or CIEXYZ."
            );
            return [0,0,0];
        }

        if (tokens[0] == "xyz") {
            console.warn("TODO: convert XYZ to RGB");
            return [0,0,0];
        }

        // from my understanding of the spec, RGB values at this point
        // will either be 3 floats or exactly 1 float, so that's the check
        // that i'm going to perform here
        if (tokens.length == 3) {
            return tokens.map(parseFloat);
        }

        // Since tokens at this point has a length of 3, we're going to assume
        // it's exactly 1, skipping the check for 2.
        var value = parseFloat(tokens[0]);
        // in this case, all values are equivalent
        return [value, value, value];
    }


    parse_Ka(tokens:string[]) {
        this.currentMaterial.ambient = this.parseColor(tokens);
    }


    parse_Kd(tokens:string[]) {
        this.currentMaterial.diffuse = this.parseColor(tokens);
    }


    parse_Ks(tokens:string[]) {
        this.currentMaterial.specular = this.parseColor(tokens);
    }


    parse_Ke(tokens:string[]) {
        this.currentMaterial.emissive = this.parseColor(tokens);
    }


    parse_Tf(tokens:string[]) {
        this.currentMaterial.transmissionFilter = this.parseColor(tokens);
    }

    parse_d(tokens:string[]) {
        // this ignores the -halo option as I can't find any documentation on what
        // it's supposed to be.
        this.currentMaterial.dissolve = parseFloat(tokens.pop() as string);
    }

    parse_illum(tokens:string[]) {
        this.currentMaterial.illumination = parseInt(tokens[0]);
    }


    parse_Ni(tokens:string[]) {
        this.currentMaterial.refractionIndex = parseFloat(tokens[0]);
    }

    parse_Ns(tokens:string[]) {
        this.currentMaterial.specularExponent = parseInt(tokens[0]);
    }


    parse_sharpness(tokens:string[]) {
        this.currentMaterial.sharpness = parseInt(tokens[0]);
    }


    parse_cc(values:string[], options:any) {
        options.colorCorrection = values[0] == "on";
    }


    parse_blendu(values:string[], options:any) {
        options.horizontalBlending = values[0] == "on";
    }

    parse_blendv(values:string[], options:any) {
        options.verticalBlending = values[0] == "on";
    }


    parse_boost(values:string[], options:any) {
        options.boostMipMapSharpness = parseFloat(values[0]);
    }


    parse_mm(values:string[], options:any) {
        options.modifyTextureMap.brightness = parseFloat(values[0]);
        options.modifyTextureMap.contrast = parseFloat(values[1]);
    }


    parse_ost(values:number[]|string[], option:any, defaultValue:number) {
        while (values.length < 3) {
            values.push(defaultValue);
        }

        option.u = parseFloat(values[0] as string);
        option.v = parseFloat(values[1] as string);
        option.w = parseFloat(values[2] as string);
    }


    parse_o(values:string[], options:any) {
        this.parse_ost(values, options.offset, 0);
    }


    parse_s(values:number[]|string[], options:any) {
        this.parse_ost(values, options.scale, 1);
    }


    parse_t(values:number[]|string[], options:any) {
        this.parse_ost(values, options.turbulence, 0);
    }


    parse_texres(values:number[]|string[], options:any) {
        options.textureResolution = parseFloat(values[0] as string);
    }


    parse_clamp(values:number[]|string[], options:any) {
        options.clamp = values[0] == "on";
    }


    parse_bm(values:string[], options:any) {
        options.bumpMultiplier = parseFloat(values[0]);
    }


    parse_imfchan(values:number[]|string[], options:any) {
        options.imfChan = values[0];
    }


    parse_type(values:number[]|string[], options:any) {
        options.reflectionType = values[0];
    }


    parseOptions(tokens:string[]) {
        var options = {
            colorCorrection: false,
            horizontalBlending: true,
            verticalBlending: true,
            boostMipMapSharpness: 0,
            modifyTextureMap: {
                brightness: 0,
                contrast: 1
            },
            offset: { u: 0, v: 0, w: 0 },
            scale: { u: 1, v: 1, w: 1 },
            turbulence: { u: 0, v: 0, w: 0 },
            clamp: false,
            textureResolution: null,
            bumpMultiplier: 1,
            imfChan: null,
            filename:''
        };

        var option:string;
        var values;
        var optionsToValues:any = {};

        tokens.reverse();

        while (tokens.length) {
            const token = tokens.pop() as string;

            if (token.charAt(0) == "-") {
                option = token.substr(1);
                optionsToValues[option] = [];
            } else {
                optionsToValues[option].push(token);
            }
        }

        for (option in optionsToValues) {
            //if (!optionsToValues.hasOwnProperty(option)) {
            if (!(option in optionsToValues)) {
                continue;
            }
            values = optionsToValues[option];

            //@ts-ignore
            var optionMethod = this['parse_' + option];
            if (optionMethod) {
                optionMethod.call(this, values, options);
            }
        }

        return options;
    }


    parseMap(tokens:string[]) {
        // according to wikipedia:
        // (https://en.wikipedia.org/wiki/Wavefront_.obj_file#Vendor_specific_alterations)
        // there is at least one vendor that places the filename before the options
        // rather than after (which is to spec). All options start with a '-'
        // so if the first token doesn't start with a '-', we're going to assume
        // it's the name of the map file.
        var filename:string;
        var options;
        if (!(tokens[0].charAt(0) == "-")) {
            [filename, ...options] = tokens;
        } else {
            filename = tokens.pop() as string;
            options = tokens;
        }

        options = this.parseOptions(options);
        options.filename = filename;
        return options;
    }


    parse_map_Ka(tokens:string[]) {
        this.currentMaterial.mapAmbient = this.parseMap(tokens);
    }


    parse_map_Kd(tokens:string[]) {
        this.currentMaterial.mapDiffuse = this.parseMap(tokens);
    }

    parse_map_Ks(tokens:string[]) {
        this.currentMaterial.mapSpecular = this.parseMap(tokens);
    }


    parse_map_Ke(tokens:string[]) {
        this.currentMaterial.mapEmissive = this.parseMap(tokens);
    }


    parse_map_Ns(tokens:string[]) {
        this.currentMaterial.mapSpecularExponent = this.parseMap(tokens);
    }


    parse_map_d(tokens:string[]) {
        this.currentMaterial.mapDissolve = this.parseMap(tokens);
    }


    parse_map_aat(tokens:string[]) {
        this.currentMaterial.antiAliasing = tokens[0] == "on";
    }


    parse_map_bump(tokens:string[]) {
        this.currentMaterial.mapBump = this.parseMap(tokens);
    }


    parse_bump(tokens:string[]) {
        this.parse_map_bump(tokens);
    }


    parse_disp(tokens:string[]) {
        this.currentMaterial.mapDisplacement = this.parseMap(tokens);
    }


    parse_decal(tokens:string[]) {
        this.currentMaterial.mapDecal = this.parseMap(tokens);
    }


    parse_refl(tokens:string[]) {
        this.currentMaterial.mapReflections.push(this.parseMap(tokens));
    }


    parse(mtlData: string) {
        var lines = mtlData.split(/\r?\n/);
        for (var i: i32 = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line || line.charAt(0) == "#") {
                continue;
            }

            var tokens  = line.split(/\s/);
            var directive = tokens[0];
            var parseMethod = this['parse_' + directive];
            if (!parseMethod) {
                console.warn("Don't know how to parse the directive: " + directive);
                continue;
            }

            [directive, ...tokens] = tokens;
            parseMethod.call(this, tokens);
        }
        this.currentMaterial = null;
    }
}


	
	// 来源 https://github.com/frenchtoast747/webgl-obj-loader	
	
	/**
	 * The main Mesh class. The constructor will parse through the OBJ file data
	 * and collect the vertex, vertex normal, texture, and face information. This
	 * information can then be used later on when creating your VBOs. See
	 * OBJ.initMeshBuffers for an example of how to use the newly created Mesh
	 */
	export class OBJLoader_mesh {
		name:string = '';
		// the list of unique vertex, normal, texture, attributes
		vertices:number[] = [];			// 顶点
		vertexNormals:number[] = [];	// 法线
		textures = [];			// UV
		// the indicies to draw the faces
		indices:number[] = [];
		textureStride = 2; 		// uv的宽度，一般是 uv，有时候是uvw
		vertexMaterialIndices = [];	//每个顶点对应的材质
		
		materialNames = [];		// 材质名表。 顶点材质的索引就是相对于这个的
		materialIndices= {};		// 
		materialsByIndex = {};
		
		tangents:number[];
		bitangents:number[];
		/**
		 * Create a Mesh
		 * @param {String} objectData - a string representation of an OBJ file with
		 *     newlines preserved.
		 * @param {Object} options - a JS object containing valid options. See class
		 *     documentation for options.
		 * @param {bool} options.enableWTextureCoord - Texture coordinates can have
		 *     an optional "w" coordinate after the u and v coordinates. This extra
		 *     value can be used in order to perform fancy transformations on the
		 *     textures themselves. Default is to truncate to only the u an v
		 *     coordinates. Passing true will provide a default value of 0 in the
		 *     event that any or all texture coordinates don't provide a w value.
		 *     Always use the textureStride attribute in order to determine the
		 *     stride length of the texture coordinates when rendering the element
		 *     array.
		 * @param {bool} options.calcTangentsAndBitangents - Calculate the tangents
		 *     and bitangents when loading of the OBJ is completed. This adds two new
		 *     attributes to the Mesh instance: `tangents` and `bitangents`.
		 */
		constructor(objectData:string, options:any) {
			options = options || {};
			options.materials = options.materials || {};
			options.enableWTextureCoord = !!options.enableWTextureCoord;
			options.indicesPerMaterial = !!options.indicesPerMaterial;

			this.textureStride = options.enableWTextureCoord ? 3 : 2;

			/*
			The OBJ file format does a sort of compression when saving a model in a
			program like Blender. There are at least 3 sections (4 including textures)
			within the file. Each line in a section begins with the same string:
			  * 'v': indicates vertex section
			  * 'vn': indicates vertex normal section
			  * 'f': indicates the faces section
			  * 'vt': indicates vertex texture section (if textures were used on the model)
			Each of the above sections (except for the faces section) is a list/set of
			unique vertices.

			Each line of the faces section contains a list of
			(vertex, [texture], normal) groups.

			**Note:** The following documentation will use a capital "V" Vertex to
			denote the above (vertex, [texture], normal) groups whereas a lowercase
			"v" vertex is used to denote an X, Y, Z coordinate.

			Some examples:
				// the texture index is optional, both formats are possible for models
				// without a texture applied
				f 1/25 18/46 12/31
				f 1//25 18//46 12//31

				// A 3 vertex face with texture indices
				f 16/92/11 14/101/22 1/69/1

				// A 4 vertex face
				f 16/92/11 40/109/40 38/114/38 14/101/22

			The first two lines are examples of a 3 vertex face without a texture applied.
			The second is an example of a 3 vertex face with a texture applied.
			The third is an example of a 4 vertex face. Note: a face can contain N
			number of vertices.

			Each number that appears in one of the groups is a 1-based index
			corresponding to an item from the other sections (meaning that indexing
			starts at one and *not* zero).

			For example:
				`f 16/92/11` is saying to
				  - take the 16th element from the [v] vertex array
				  - take the 92nd element from the [vt] texture array
				  - take the 11th element from the [vn] normal array
				and together they make a unique vertex.
			Using all 3+ unique Vertices from the face line will produce a polygon.

			Now, you could just go through the OBJ file and create a new vertex for
			each face line and WebGL will draw what appears to be the same model.
			However, vertices will be overlapped and duplicated all over the place.

			Consider a cube in 3D space centered about the origin and each side is
			2 units long. The front face (with the positive Z-axis pointing towards
			you) would have a Top Right vertex (looking orthogonal to its normal)
			mapped at (1,1,1) The right face would have a Top Left vertex (looking
			orthogonal to its normal) at (1,1,1) and the top face would have a Bottom
			Right vertex (looking orthogonal to its normal) at (1,1,1). Each face
			has a vertex at the same coordinates, however, three distinct vertices
			will be drawn at the same spot.

			To solve the issue of duplicate Vertices (the `(vertex, [texture], normal)`
			groups), while iterating through the face lines, when a group is encountered
			the whole group string ('16/92/11') is checked to see if it exists in the
			packed.hashindices object, and if it doesn't, the indices it specifies
			are used to look up each attribute in the corresponding attribute arrays
			already created. The values are then copied to the corresponding unpacked
			array (flattened to play nice with WebGL's ELEMENT_ARRAY_BUFFER indexing),
			the group string is added to the hashindices set and the current unpacked
			index is used as this hashindices value so that the group of elements can
			be reused. The unpacked index is incremented. If the group string already
			exists in the hashindices object, its corresponding value is the index of
			that group and is appended to the unpacked indices array.
		   */
			const verts = [];
			const vertNormals = [];
            const textures = [];
            interface Unpack{
                verts:number[],
                norms:number[],
                textures:string[],
                hashindices:{},
                indices:number[][],
                materialIndices:number[],
                index:number
            }
			const unpacked:Unpack = {} as Unpack;
			const materialNamesByIndex = [];
			const materialIndicesByName:any = {};
			// keep track of what material we've seen last
			var currentMaterialIndex = -1;
			// keep track if pushing indices by materials - otherwise not used
			var currentObjectByMaterialIndex = 0;
			// unpacking stuff
			unpacked.verts = [];
			unpacked.norms = [];
			unpacked.textures = [];
			unpacked.hashindices = {};
			unpacked.indices = [[]];
			unpacked.materialIndices = [];
			unpacked.index = 0;

			const VERTEX_RE = /^v\s/;
			const NORMAL_RE = /^vn\s/;
			const TEXTURE_RE = /^vt\s/;		//uv
			const FACE_RE = /^f\s/;
			const WHITESPACE_RE = /\s+/;
			const USE_MATERIAL_RE = /^usemtl/;

			// array of lines separated by the newline
			const lines = objectData.split("\n");

			for (var i:int = 0; i < lines.length; i++) {
				const line:string = lines[i].trim();
				if (!line || line.charAt(0)=="#") {	//空行或者注释
					continue;
				}
				const elements = line.split(WHITESPACE_RE);
				elements.shift();

				if (VERTEX_RE.test(line)) {
					// if this is a vertex
					verts.push(...elements);
				} else if (NORMAL_RE.test(line)) {
					// if this is a vertex normal
					vertNormals.push(...elements);
				} else if (TEXTURE_RE.test(line)) {
					var coords= elements;
					// by default, the loader will only look at the U and V
					// coordinates of the vt declaration. So, this truncates the
					// elements to only those 2 values. If W texture coordinate
					// support is enabled, then the texture coordinate is
					// expected to have three values in it.
					if (elements.length > 2 && !options.enableWTextureCoord) {
						coords = elements.slice(0, 2);
					} else if (elements.length === 2 && options.enableWTextureCoord) {
						// If for some reason W texture coordinate support is enabled
						// and only the U and V coordinates are given, then we supply
						// the default value of 0 so that the stride length is correct
						// when the textures are unpacked below.
						coords.push(0);
					}
					textures.push(...coords);
				} else if (USE_MATERIAL_RE.test(line)) {
					const materialName:string = elements[0];

					// check to see if we've ever seen it before
					if (!(materialName in materialIndicesByName)) {
						// new material we've never seen
						materialNamesByIndex.push(materialName);
						materialIndicesByName[materialName] = materialNamesByIndex.length - 1;
						// push new array into indices
						if (options.indicesPerMaterial) {
							// already contains an array at index zero, don't add
							if (materialIndicesByName[materialName] > 0) {
								unpacked.indices.push([]);
							}
						}
					}
					// keep track of the current material index
					currentMaterialIndex = materialIndicesByName[materialName];
					// update current index array
					if (options.indicesPerMaterial) {
						currentObjectByMaterialIndex = currentMaterialIndex;
					}
				} else if (FACE_RE.test(line)) {
					// if this is a face
					/*
					split this face into an array of Vertex groups
					for example:
					   f 16/92/11 14/101/22 1/69/1
					becomes:
					  ['16/92/11', '14/101/22', '1/69/1'];
					*/
					var quad = false;
					for (var j = 0, eleLen = elements.length; j < eleLen; j++) {
						// Triangulating quads
						// quad: 'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2 v3/t3/vn3/'
						// corresponding triangles:
						//      'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2'
						//      'f v2/t2/vn2 v3/t3/vn3 v0/t0/vn0'
						if (j === 3 && !quad) {
							// add v2/t2/vn2 in again before continuing to 3
							j = 2;
							quad = true;
						}
						const hash0 = elements[0] + "," + currentMaterialIndex;
						const hash = elements[j] + "," + currentMaterialIndex;
						if (hash in unpacked.hashindices) {
							unpacked.indices[currentObjectByMaterialIndex].push(unpacked.hashindices[hash]);
						} else {
							/*
							Each element of the face line array is a Vertex which has its
							attributes delimited by a forward slash. This will separate
							each attribute into another array:
								'19/92/11'
							becomes:
								Vertex = ['19', '92', '11'];
							where
								Vertex[0] is the vertex index
								Vertex[1] is the texture index
								Vertex[2] is the normal index
							 Think of faces having Vertices which are comprised of the
							 attributes location (v), texture (vt), and normal (vn).
							 */
							var vertex = elements[j].split("/").map(v=>parseInt(v));
							// it's possible for faces to only specify the vertex
							// and the normal. In this case, vertex will only have
							// a length of 2 and not 3 and the normal will be the
							// second item in the list with an index of 1.
							var normalIndex = vertex.length - 1;
							/*
							 The verts, textures, and vertNormals arrays each contain a
							 flattend array of coordinates.

							 Because it gets confusing by referring to Vertex and then
							 vertex (both are different in my descriptions) I will explain
							 what's going on using the vertexNormals array:

							 vertex[2] will contain the one-based index of the vertexNormals
							 section (vn). One is subtracted from this index number to play
							 nice with javascript's zero-based array indexing.

							 Because vertexNormal is a flattened array of x, y, z values,
							 simple pointer arithmetic is used to skip to the start of the
							 vertexNormal, then the offset is added to get the correct
							 component: +0 is x, +1 is y, +2 is z.

							 This same process is repeated for verts and textures.
							 */
							// Vertex position
							unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 0]);
							unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 1]);
							unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 2]);
							// Vertex textures
							if (textures.length) {
								var stride = options.enableWTextureCoord ? 3 : 2;
								unpacked.textures.push(+textures[(vertex[1] - 1) * stride + 0]);
								unpacked.textures.push(+textures[(vertex[1] - 1) * stride + 1]);
								if (options.enableWTextureCoord) {
									unpacked.textures.push(+textures[(vertex[1] - 1) * stride + 2]);
								}
							}
							// Vertex normals
							unpacked.norms.push(+vertNormals[(vertex[normalIndex] - 1) * 3 + 0]);
							unpacked.norms.push(+vertNormals[(vertex[normalIndex] - 1) * 3 + 1]);
							unpacked.norms.push(+vertNormals[(vertex[normalIndex] - 1) * 3 + 2]);
							// Vertex material indices
							unpacked.materialIndices.push(currentMaterialIndex);
							// add the newly created Vertex to the list of indices
							unpacked.hashindices[hash] = unpacked.index;
							unpacked.indices[currentObjectByMaterialIndex].push(unpacked.hashindices[hash]);
							// increment the counter
							unpacked.index += 1;
						}
						if (j === 3 && quad) {
							// add v0/t0/vn0 onto the second triangle
							unpacked.indices[currentObjectByMaterialIndex].push(unpacked.hashindices[hash0]);
						}
					}
				}
			}
			// 注意由于有重名，下面的this不要删除
			this.vertices = unpacked.verts;
			this.vertexNormals = unpacked.norms;
			this.textures = unpacked.textures;
			this.vertexMaterialIndices = unpacked.materialIndices;
			this.indices = options.indicesPerMaterial ? unpacked.indices : unpacked.indices[currentObjectByMaterialIndex];

			this.materialNames = materialNamesByIndex;
			this.materialIndices = materialIndicesByName;
			this.materialsByIndex = {};

			if (options.calcTangentsAndBitangents) {
				this.calculateTangentsAndBitangents();
			}
		}

		/**
		 * Calculates the tangents and bitangents of the mesh that forms an orthogonal basis together with the
		 * normal in the direction of the texture coordinates. These are useful for setting up the TBN matrix
		 * when distorting the normals through normal maps.
		 * Method derived from: http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/
		 *
		 * This method requires the normals and texture coordinates to be parsed and set up correctly.
		 * Adds the tangents and bitangents as members of the class instance.
		 */
		calculateTangentsAndBitangents() {
			console.assert(
				this.vertices &&
					this.vertices.length &&
					this.vertexNormals &&
					this.vertexNormals.length &&
					this.textures &&
					this.textures.length,
				"Missing attributes for calculating tangents and bitangents"
			);

            let len = this.vertices.length;
            var unpacked:{tangents:number[],bitangents:number[]} = {tangents:[],bitangents:[]};
			unpacked.tangents = new Array(len).fill(0);
			unpacked.bitangents = [...new Array(this.vertices.length)].map(v => 0);

			// Loop through all faces in the whole mesh
			var indices;
			// If sorted by material
			if (Array.isArray(this.indices[0])) {
				indices = [].concat.apply([], this.indices);
			} else {
				indices = this.indices;
			}

			const vertices = this.vertices;
			const normals = this.vertexNormals;
			const uvs = this.textures;

			for (var i = 0; i < indices.length; i += 3) {
				const i0 = indices[i + 0];
				const i1 = indices[i + 1];
				const i2 = indices[i + 2];

				const x_v0 = vertices[i0 * 3 + 0];
				const y_v0 = vertices[i0 * 3 + 1];
				const z_v0 = vertices[i0 * 3 + 2];

				const x_uv0 = uvs[i0 * 2 + 0];
				const y_uv0 = uvs[i0 * 2 + 1];

				const x_v1 = vertices[i1 * 3 + 0];
				const y_v1 = vertices[i1 * 3 + 1];
				const z_v1 = vertices[i1 * 3 + 2];

				const x_uv1 = uvs[i1 * 2 + 0];
				const y_uv1 = uvs[i1 * 2 + 1];

				const x_v2 = vertices[i2 * 3 + 0];
				const y_v2 = vertices[i2 * 3 + 1];
				const z_v2 = vertices[i2 * 3 + 2];

				const x_uv2 = uvs[i2 * 2 + 0];
				const y_uv2 = uvs[i2 * 2 + 1];

				const x_deltaPos1 = x_v1 - x_v0;
				const y_deltaPos1 = y_v1 - y_v0;
				const z_deltaPos1 = z_v1 - z_v0;

				const x_deltaPos2 = x_v2 - x_v0;
				const y_deltaPos2 = y_v2 - y_v0;
				const z_deltaPos2 = z_v2 - z_v0;

				const x_uvDeltaPos1 = x_uv1 - x_uv0;
				const y_uvDeltaPos1 = y_uv1 - y_uv0;

				const x_uvDeltaPos2 = x_uv2 - x_uv0;
				const y_uvDeltaPos2 = y_uv2 - y_uv0;

				const rInv = x_uvDeltaPos1 * y_uvDeltaPos2 - y_uvDeltaPos1 * x_uvDeltaPos2;
				const r = 1.0 / (Math.abs(rInv) < 0.0001 ? 1.0 : rInv);

				// Tangent
				const x_tangent = (x_deltaPos1 * y_uvDeltaPos2 - x_deltaPos2 * y_uvDeltaPos1) * r;
				const y_tangent = (y_deltaPos1 * y_uvDeltaPos2 - y_deltaPos2 * y_uvDeltaPos1) * r;
				const z_tangent = (z_deltaPos1 * y_uvDeltaPos2 - z_deltaPos2 * y_uvDeltaPos1) * r;

				// Bitangent
				const x_bitangent = (x_deltaPos2 * x_uvDeltaPos1 - x_deltaPos1 * x_uvDeltaPos2) * r;
				const y_bitangent = (y_deltaPos2 * x_uvDeltaPos1 - y_deltaPos1 * x_uvDeltaPos2) * r;
				const z_bitangent = (z_deltaPos2 * x_uvDeltaPos1 - z_deltaPos1 * x_uvDeltaPos2) * r;

				// Gram-Schmidt orthogonalize
				//t = glm::normalize(t - n * glm:: dot(n, t));
				const x_n0 = normals[i0 * 3 + 0];
				const y_n0 = normals[i0 * 3 + 1];
				const z_n0 = normals[i0 * 3 + 2];

				const x_n1 = normals[i1 * 3 + 0];
				const y_n1 = normals[i1 * 3 + 1];
				const z_n1 = normals[i1 * 3 + 2];

				const x_n2 = normals[i2 * 3 + 0];
				const y_n2 = normals[i2 * 3 + 1];
				const z_n2 = normals[i2 * 3 + 2];

				// Tangent
				const n0_dot_t = x_tangent * x_n0 + y_tangent * y_n0 + z_tangent * z_n0;
				const n1_dot_t = x_tangent * x_n1 + y_tangent * y_n1 + z_tangent * z_n1;
				const n2_dot_t = x_tangent * x_n2 + y_tangent * y_n2 + z_tangent * z_n2;

				const x_resTangent0 = x_tangent - x_n0 * n0_dot_t;
				const y_resTangent0 = y_tangent - y_n0 * n0_dot_t;
				const z_resTangent0 = z_tangent - z_n0 * n0_dot_t;

				const x_resTangent1 = x_tangent - x_n1 * n1_dot_t;
				const y_resTangent1 = y_tangent - y_n1 * n1_dot_t;
				const z_resTangent1 = z_tangent - z_n1 * n1_dot_t;

				const x_resTangent2 = x_tangent - x_n2 * n2_dot_t;
				const y_resTangent2 = y_tangent - y_n2 * n2_dot_t;
				const z_resTangent2 = z_tangent - z_n2 * n2_dot_t;

				const magTangent0 = Math.sqrt(
					x_resTangent0 * x_resTangent0 + y_resTangent0 * y_resTangent0 + z_resTangent0 * z_resTangent0
				);
				const magTangent1 = Math.sqrt(
					x_resTangent1 * x_resTangent1 + y_resTangent1 * y_resTangent1 + z_resTangent1 * z_resTangent1
				);
				const magTangent2 = Math.sqrt(
					x_resTangent2 * x_resTangent2 + y_resTangent2 * y_resTangent2 + z_resTangent2 * z_resTangent2
				);

				// Bitangent
				const n0_dot_bt = x_bitangent * x_n0 + y_bitangent * y_n0 + z_bitangent * z_n0;
				const n1_dot_bt = x_bitangent * x_n1 + y_bitangent * y_n1 + z_bitangent * z_n1;
				const n2_dot_bt = x_bitangent * x_n2 + y_bitangent * y_n2 + z_bitangent * z_n2;

				const x_resBitangent0 = x_bitangent - x_n0 * n0_dot_bt;
				const y_resBitangent0 = y_bitangent - y_n0 * n0_dot_bt;
				const z_resBitangent0 = z_bitangent - z_n0 * n0_dot_bt;

				const x_resBitangent1 = x_bitangent - x_n1 * n1_dot_bt;
				const y_resBitangent1 = y_bitangent - y_n1 * n1_dot_bt;
				const z_resBitangent1 = z_bitangent - z_n1 * n1_dot_bt;

				const x_resBitangent2 = x_bitangent - x_n2 * n2_dot_bt;
				const y_resBitangent2 = y_bitangent - y_n2 * n2_dot_bt;
				const z_resBitangent2 = z_bitangent - z_n2 * n2_dot_bt;

				const magBitangent0 = Math.sqrt(
					x_resBitangent0 * x_resBitangent0 +
						y_resBitangent0 * y_resBitangent0 +
						z_resBitangent0 * z_resBitangent0
				);
				const magBitangent1 = Math.sqrt(
					x_resBitangent1 * x_resBitangent1 +
						y_resBitangent1 * y_resBitangent1 +
						z_resBitangent1 * z_resBitangent1
				);
				const magBitangent2 = Math.sqrt(
					x_resBitangent2 * x_resBitangent2 +
						y_resBitangent2 * y_resBitangent2 +
						z_resBitangent2 * z_resBitangent2
				);

				unpacked.tangents[i0 * 3 + 0] += x_resTangent0 / magTangent0;
				unpacked.tangents[i0 * 3 + 1] += y_resTangent0 / magTangent0;
				unpacked.tangents[i0 * 3 + 2] += z_resTangent0 / magTangent0;

				unpacked.tangents[i1 * 3 + 0] += x_resTangent1 / magTangent1;
				unpacked.tangents[i1 * 3 + 1] += y_resTangent1 / magTangent1;
				unpacked.tangents[i1 * 3 + 2] += z_resTangent1 / magTangent1;

				unpacked.tangents[i2 * 3 + 0] += x_resTangent2 / magTangent2;
				unpacked.tangents[i2 * 3 + 1] += y_resTangent2 / magTangent2;
				unpacked.tangents[i2 * 3 + 2] += z_resTangent2 / magTangent2;

				unpacked.bitangents[i0 * 3 + 0] += x_resBitangent0 / magBitangent0;
				unpacked.bitangents[i0 * 3 + 1] += y_resBitangent0 / magBitangent0;
				unpacked.bitangents[i0 * 3 + 2] += z_resBitangent0 / magBitangent0;

				unpacked.bitangents[i1 * 3 + 0] += x_resBitangent1 / magBitangent1;
				unpacked.bitangents[i1 * 3 + 1] += y_resBitangent1 / magBitangent1;
				unpacked.bitangents[i1 * 3 + 2] += z_resBitangent1 / magBitangent1;

				unpacked.bitangents[i2 * 3 + 0] += x_resBitangent2 / magBitangent2;
				unpacked.bitangents[i2 * 3 + 1] += y_resBitangent2 / magBitangent2;
				unpacked.bitangents[i2 * 3 + 2] += z_resBitangent2 / magBitangent2;

				// TODO: check handedness
			}

			this.tangents = unpacked.tangents;
			this.bitangents = unpacked.bitangents;
		}


		addMaterialLibrary(mtl:OBJLoader_Material) {
			for (var name in mtl.materials) {
				if (!(name in this.materialIndices)) {
					// This material is not referenced by the mesh
					continue;
				}

				var material = mtl.materials[name];

				// Find the material index for this material
				var materialIndex = this.materialIndices[material.name];

				// Put the material into the materialsByIndex object at the right
				// spot as determined when the obj file was parsed
				this.materialsByIndex[materialIndex] = material;
			}
		}
	}
