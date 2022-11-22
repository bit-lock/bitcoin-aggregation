import { UTXO } from "../models/UTXO";
export declare const fetchUtxos: (address: string) => Promise<UTXO[]>;
export declare const calculateTxFees: (utxos: UTXO[], minimumSignatoryCount: number, template: string) => Promise<number>;
export declare const createDestinationPubkey: (destinationAddress: string) => {
    errorMessage: string;
    scriptPubkey: string;
};
export declare const bitcoinBalanceCalculation: (utxos: UTXO[]) => number;
export declare const lexicographical: (aTx: string, bTx: string) => number;
export declare const convertTo35Byte: (hex: string) => string;
export declare const BITCOIN_PER_SATOSHI = 100000000;
export declare const broadcast: (hex: string) => Promise<string>;
