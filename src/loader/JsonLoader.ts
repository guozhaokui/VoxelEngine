

export interface nodeProxy{
	getRealNode():any;
	setProp(name:string, value:any, node:any, loader:JSONLoader):void;
	setPropEnd( node:any, loader:JSONLoader):void;
}

/**
 * 遍历所有的节点，创建对应的对象，设置属性
 * 管理引用关系
 * 具体加载需要有一个代理类，接收对应的属性，并赋值给实际对象
 * 有个潜规则是假设每个节点有type属性。没有也可以，但是不能分类了
 * 
 * node 动态增加
 * 		___id
 * 		___proxynode
 * 		___parent
 * 这里做遍历的事情，具体加载器就只要管一层就行了。
 */
export class JSONLoader{
	typesMap:{[key:string]:any[]}={};	// 

	getNodeByName(name:string,type:string){

	}

	loadJSON(obj:any, creater:(l:JSONLoader,nodeObj:any)=>nodeProxy|null){
		let allnodes:any[]=[];
		// 遍历所有节点。 创建空对象
		let cid=0;
		//obj.___id=cid++;
		//obj.___proxynode = null;
		//obj.___parent=null;

		let typesMap = this.typesMap;
		let stack:any[]=[];
		stack.push(obj);
		while(stack.length>0){
			let cn = stack.pop();
			allnodes.push(cn);
			// 分组
			let type = cn.type;
			if(type && typeof(type)==='string'){
				if(!typesMap[type])
					typesMap[type]=[];
				typesMap[type].push(cn);
			}

			// 属性，成员
			for(let i in cn){
				if(i=='___parent')
					continue;
				if(typeof(cn[i])==='object'){
					cn[i].___parent=cn;
					stack.push(cn[i]);
				}
			}
			// 这个放到后面，不要影响cn的结构
			cn.___id=cid++;
			cn.___proxynode = creater(this, cn);
		}

		// 设置属性
		allnodes.forEach( cn=>{
			let proxy = cn.___proxynode;
			if(proxy){
				for(let i in cn){
					if(i=='___id' || i=='___proxynode' || i=='___parent')
						continue;
					proxy.setProp(i, cn[i], cn, this);
				}
				proxy.setPropEnd(cn,this);
			}
		});
	}
}
