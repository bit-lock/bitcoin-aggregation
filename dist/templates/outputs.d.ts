import { UTXO } from "../lib/models/UTXO";
export declare const outputTemplate: (utxo: UTXO[], amount: number, destinationScriptPubkey: string, minimumSignatoryCount: number, script: string, address: string) => Promise<string>;
