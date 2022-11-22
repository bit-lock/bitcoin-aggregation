declare var bech32_ecc: any;
declare function convertbits(data: string | any[], frombits: number, tobits: number, pad: boolean): number[] | null;
declare function check2(addr: string | any[], validHrp: any): {
    error: any;
    pos: any;
    version?: undefined;
    program?: undefined;
} | {
    error: null;
    version: any;
    program: number[];
    pos?: undefined;
};
