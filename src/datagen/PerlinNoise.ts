
//This code is from Kas Thomas' blog:
//  http://asserttrue.blogspot.de/2011/12/perlin-noise-in-javascript_31.html

// This is a port of Ken Perlin's Java code. The
// original Java code is at http://cs.nyu.edu/%7Eperlin/noise/.
// Note that in this version, a number from 0 to 1 is returned.

/*
x /= w; y /= h; // normalize
size = 10;  // pick a scaling value
n = PerlinNoise.noise( size*x, size*y, .8 );
r = g = b = Math.round( 255 * n );

*/

var permutation = [ 151,160,137,91,90,15,
	131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
	190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
	88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
	77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
	102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
	135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
	5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
	223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
	129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
	251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
	49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
	138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
	];

	// 插值函数，0到1之间输入和输出 f = 6t^5 - 15t^4 + 10t^3
	function fade(t:number) { return t * t * t * (t * (t * 6 - 15) + 10); }

	function lerp( t:number, a:number, b:number) { return a + t * (b - a); }

	/**
	 * 从12个预定义梯度中随机选取一个，并与xyz进行点积。
	 * @param hash 
	 * @param x 
	 * @param y 
	 * @param z 
	 */
	function grad(hash:number, x:number, y:number, z:number) {
	   var h = hash & 15;                       // CONVERT LO 4 BITS OF HASH CODE
	   // uv根据h的bit来选择xyz
	   var  u = h<8 ? x : y,                 	// INTO 12 GRADIENT DIRECTIONS.
			v = h<4 ? y : h==12||h==14 ? x : z;

		// h的1,2bit来决定u和v的符号
	   return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
	} 

	// 转到0到1之间
	function scale(n:number) { return (1 + n)/2; }


export function noise(x:number, y:number, z:number){
	var p = new Array(512);
	for( var i=0; i<256; i++)
		p[256+i] = p[i] = permutation[i];

	var X = Math.floor(x)&255,	// 所在整数格子
		Y = Math.floor(y)&255,
		Z = Math.floor(z)&255;
	x-=Math.floor(x);	// 小数部分
	y-=Math.floor(y);
	z-=Math.floor(z);
	var u = fade(x),	// fade之后的值
		v = fade(y),
		w = fade(z);
	// HASH COORDINATES OF THE 8 CUBE CORNERS,
	var A = p[X  ]+Y, AA=p[A]+Z, AB=p[A+1]+Z;
	var B = p[X+1]+Y, BA=p[B]+Z, BB=p[B+1]+Z;

	// AND ADD BLENDED RESULTS FROM  8 CORNERS OF CUBE
	// 一共7次插值 4+2+1
	return scale(
				lerp(w, 
					lerp(v, 
						lerp(u, grad(p[AA  ], x  , y  , z   ), grad(p[BA  ], x-1, y  , z   )),
						lerp(u, grad(p[AB  ], x  , y-1, z   ), grad(p[BB  ], x-1, y-1, z   ))
					),
					lerp(v, 
						lerp(u, grad(p[AA+1], x  , y  , z-1 ), grad(p[BA+1], x-1, y  , z-1 )),
						lerp(u, grad(p[AB+1], x  , y-1, z-1 ), grad(p[BB+1], x-1, y-1, z-1 ))
					)
				)
			);
}


// Source: http://riven8192.blogspot.com/2010/08/calculate-perlinnoise-twice-as-fast.html
// 等效于上面的grad
function grad1(hash:int, x:number,  y:number, z:number){
    switch(hash & 0xF){
        case 0x0: return  x + y;
        case 0x1: return -x + y;
        case 0x2: return  x - y;
        case 0x3: return -x - y;
        case 0x4: return  x + z;
        case 0x5: return -x + z;
        case 0x6: return  x - z;
        case 0x7: return -x - z;
        case 0x8: return  y + z;
        case 0x9: return -y + z;
        case 0xA: return  y - z;
        case 0xB: return -y - z;
        case 0xC: return  y + x;
        case 0xD: return -y + z;
        case 0xE: return  y - x;
        case 0xF: return -y - z;
        default: return 0; // never happens
    }
}
