import Web3 from "web3";
import BtcVault from "../lib/contracts/BtcVault.json";
import { VaultContract } from "./models/VaultContract";
import { Signatories } from "./models/Signatories";

class Web3Lib {
  private web3: Web3;
  private contract: any;

  constructor() {
    this.web3 = new Web3("https://goerli.infura.io/v3/bb8c81af0ae0446f9652ca3b3ffdf2b1");

    this.initContract();
  }

  private initContract = () => {
    this.contract = new this.web3.eth.Contract(BtcVault.abi as any, BtcVault.address);
  };

  getVaultLength = async (): Promise<number> => {
    return this.contract.methods.getVaultLength().call();
  };

  getVaults = async (id: number): Promise<VaultContract> => {
    return this.contract.methods.vaults(id).call();
  };

  getSignatories = async (id: number): Promise<Signatories> => {
    return this.contract.methods.getSignatories(id).call();
  };

  nextProposalId = async (vaultId: number): Promise<number> => {
    return this.contract.methods.nextProposalId(vaultId).call();
  };

  getWithdrawRequest = async (vaultId: number, proposalId: number): Promise<string> => {
    return this.contract.methods.getWithdrawRequest(vaultId, proposalId).call();
  };

  getWithdrawRequestSigs = async (vaultId: number, proposalId: number, signatoryAddress: string) => {
    return this.contract.methods.getWithdrawRequestSigs(vaultId, proposalId, signatoryAddress).call();
  };
}

export default Web3Lib;
