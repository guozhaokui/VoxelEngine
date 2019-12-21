//import { PerfHUD } from "./PerfHUD";
let DATANUM = 300;
export class PerfData {
    constructor(id, color, name, scale) {
        this.scale = 1.0;
        this.datas = new Array(DATANUM);
        this.datapos = 0;
        this.id = id;
        this.color = color;
        this.name = name;
        this.scale = scale;
    }
    addData(v) {
        this.datas[this.datapos] = v;
        this.datapos++;
        this.datapos %= DATANUM;
    }
}
