import { Signatories } from "./Signatories";
import { UTXO } from "./UTXO";
import { Vault } from "./Vault";
export declare type VaultState = {
    id: number;
    isMyOwner: boolean;
    signatories: Signatories;
    vault: Vault;
    minimumSignatoryCount: number;
    proposalIds?: number[];
    bitcoin?: {
        address: string;
        balance: number;
        fee: number;
        utxos?: UTXO[];
    };
};
