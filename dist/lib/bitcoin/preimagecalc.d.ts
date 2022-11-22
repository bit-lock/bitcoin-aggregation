import { UTXO } from "../models/UTXO";
export declare const calculateSighashPreimage: (utxoSet: UTXO[], feeGap: number, vaultAddress: string, destinationScriptPubkey: string, amount: number, script: string) => string[];
export declare const calculatePrevouts: (utxoSet: UTXO[]) => any;
export declare const calculateShaAmounts: (utxoSet: UTXO[]) => any;
export declare const calculateScriptPubkeys: (utxoSet: UTXO[], scriptPubkey: string) => any;
export declare const calculateShaSequences: (utxoSet: UTXO[]) => any;
export declare const calculateShaOutputs: (feeGap: number, hasChange: boolean, vaultScriptPubkey: string, destinationScriptPubkey: string, amount: number) => any;
export declare const signPreimages: (privateKey: string, preImages: string[]) => string[];
