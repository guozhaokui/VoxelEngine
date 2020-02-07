import { Entity } from './Entity';

var objectPools={};

export class Component{
    el:Entity;
    //name:string;

    /** 事件处理函数 */
    events:{[key:string]:(e:string)=>void};

    /**
     * 
     * @param el 
     * @param id 相同类的组件可以放多个
     */
    constructor(el:Entity, attrValue:String, id:int){
        this.el=el;
        // el.components[this. name]=this; 不知道怎么 获得子类的名字。而且这个容易被 混淆掉
    }
    /**
     * 数据发生改变的时候的回调
     * @param oldData 
     */
    udpate(oldData:any){

    }

    tick(tm:number,dt:number){
        
    }


}


export function registerComponent(name:string, definition:Object) {
}