export declare class GeolocationInfo {
    private pos;
    private coords;
    setPosition(pos: any): void;
    get latitude(): number;
    get longitude(): number;
    get altitude(): number;
    get accuracy(): number;
    get altitudeAccuracy(): number;
    get heading(): number;
    get speed(): number;
    get timestamp(): number;
}
