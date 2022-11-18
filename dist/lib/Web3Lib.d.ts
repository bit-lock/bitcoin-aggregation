import { VaultContract } from "./models/VaultContract";
import { Signatories } from "./models/Signatories";
export declare class Web3Lib {
    private web3;
    private contract;
    constructor();
    private initContract;
    getVaultLength: () => Promise<number>;
    getVaults: (id: number) => Promise<VaultContract>;
    getSignatories: (id: number) => Promise<Signatories>;
    nextProposalId: (vaultId: number) => Promise<number>;
    getWithdrawRequest: (vaultId: number, proposalId: number) => Promise<string>;
    getWithdrawRequestSigs: (vaultId: number, proposalId: number, signatoryAddress: string) => Promise<any>;
}
