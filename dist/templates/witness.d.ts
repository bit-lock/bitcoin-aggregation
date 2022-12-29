import { Signatories } from "../lib/models/Signatories";
import { UTXO } from "../lib/models/UTXO";
export declare const witnessTemplate: (utxo: UTXO[], signatories: Signatories, sigs: string[], script: string) => string;
