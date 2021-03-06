/**
     * <code>Rand</code> 类用于通过128位整型种子创建随机数,算法来自:https://github.com/AndreasMadsen/xorshift。
     */
export declare class RandX {
    /**基于时间种子的随机数。*/
    static defaultRand: RandX;
    /**
     * 创建一个 <code>Rand</code> 实例。
     * @param	seed  随机种子。
     */
    constructor(seed: any[]);
    /**
     * 通过2x32位的数组，返回64位的随机数。
     * @return 64位的随机数。
     */
    randomint(): any[];
    /**
     * 返回[0,1)之间的随机数。
     * @return
     */
    random(): number;
}
