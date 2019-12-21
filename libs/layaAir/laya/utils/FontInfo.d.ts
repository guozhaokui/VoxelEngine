export declare class FontInfo {
    static EMPTY: FontInfo;
    private static _cache;
    private static _gfontID;
    private static _lastFont;
    private static _lastFontInfo;
    static Parse(font: string): FontInfo;
    constructor(font: string);
    setFont(value: string): void;
}
