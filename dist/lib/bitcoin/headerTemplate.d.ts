import { Signatories } from "../models/Signatories";
export declare const bitcoinTemplateMaker: (unlocking_threshold: number, signatories: Signatories) => {
    script: string;
    address: string;
};
