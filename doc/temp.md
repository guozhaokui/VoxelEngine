
程序：
为了便于编辑，输出的数据最好是完整的，包含着后级需要的所有数据，后级不必跨级找前面需要的数据

数据：
    数据最好集中到一起，方便编辑。虽然使用起来不如在对象中更方便
    数据就是数据，不生成具体对象，具体对象的生成在实际使用的地方

动态数据：
    要保存生成参数，而不是生成结果
    属性可以是一个生成器对象，加载的时候判断是否是生成器（有某个函数）是的话，从函数取结果
动态节点
    节点个数不定，根据数据生成不同的节点个数
数据改变通知


VR键盘
    https://uxdesign.cc/keyboard-input-for-virtual-reality-d551a29c53e9
    https://www.mdpi.com/2227-7080/7/2/31/htm

	

voxel
	https://web.archive.org/web/20170713094715if_/http://www.frankpetterson.com/publications/dualcontour/dualcontour.pdf
	https://lists.blender.org/pipermail/bf-committers/2011-March/030758.html	

	https://www.cse.wustl.edu/~taoju/


https://stackoverflow.com/questions/6485908/basic-dual-contouring-theory	


平滑方法：
	收缩法：
		缺点：
		内圈效果肯定不对
		角会有凸起
		不会出现圆滑的效果

voxel数据
	实际数据是边上的数据
	1. 相当于错位一下，每个格子存的是(-1,-1,-1)位置处的边，这样每个格子能存一条边的一个值
	2. 格子保存自己所有边的数据，见hermit data
hermit data
	
