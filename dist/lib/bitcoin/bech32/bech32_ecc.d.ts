declare var CHARSET: string;
declare var GENERATOR: number[];
declare var GF1024_EXP: number[];
declare var GF1024_LOG: number[];
declare const encodings: {
    BECH32: string;
    BECH32M: string;
};
declare function getEncodingConst(encoding: string): 1 | 734539939 | null;
declare function syndrome(residue: number): number;
declare function locate_errors(residue: number, length: number): number[];
declare function polymod(values: string | any[]): number;
declare function hrpExpand(hrp: string): number[];
declare function range(from: number, to: number): number[];
declare function check(bechString: string, validHrp: string | any[], encoding: string): {
    error: string;
    pos: number[];
    data_pattern?: undefined;
    hrp?: undefined;
    data?: undefined;
} | {
    error: string;
    pos: null;
    data_pattern?: undefined;
    hrp?: undefined;
    data?: undefined;
} | {
    error: string;
    data_pattern: null;
    pos?: undefined;
    hrp?: undefined;
    data?: undefined;
} | {
    error: string;
    data_pattern: number[];
    pos?: undefined;
    hrp?: undefined;
    data?: undefined;
} | {
    error: null;
    hrp: string;
    data: number[];
    pos?: undefined;
    data_pattern?: undefined;
};
