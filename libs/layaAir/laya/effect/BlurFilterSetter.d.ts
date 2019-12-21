import { FilterSetterBase } from "././FilterSetterBase";
/**
 * ...
 * @author ww
 */
export declare class BlurFilterSetter extends FilterSetterBase {
    private _strength;
    constructor();
    /**
     * @override
     */
    protected buildFilter(): void;
    get strength(): number;
    set strength(value: number);
}
