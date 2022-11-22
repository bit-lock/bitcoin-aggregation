import { VaultContract } from "./models/VaultContract";
import { Signatories } from "./models/Signatories";
declare class Web3Lib {
    private web3;
    private contract;
    private static instance;
    constructor();
    private initContract;
    static getInstance(): Web3Lib;
    getVaultLength: () => Promise<number>;
    getVaults: (id: number) => Promise<VaultContract>;
    getSignatories: (id: number) => Promise<Signatories>;
    nextProposalId: (vaultId: number) => Promise<number>;
    getWithdrawRequest: (vaultId: number, proposalId: number) => Promise<string>;
    getWithdrawRequestSigs: (vaultId: number, proposalId: number, signatoryAddress: string) => Promise<any>;
}
export default Web3Lib;
