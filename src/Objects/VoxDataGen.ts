import { IEditableObject } from '../editor/Interfaces';

class DataGen implements IEditableObject{
    type='';
    sidelen=10;
    min=-2;
    max=2
    getDataDesc(): Object {
        return {
            "type":{},
            "sidelen":{},
            "min":{},
            "max":{}
        }
    }
}