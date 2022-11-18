"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Lib = void 0;
const web3_1 = __importDefault(require("web3"));
const BtcVault_json_1 = __importDefault(require("../lib/contracts/BtcVault.json"));
class Web3Lib {
    constructor() {
        this.initContract = () => {
            this.contract = new this.web3.eth.Contract(BtcVault_json_1.default.abi, BtcVault_json_1.default.address);
        };
        this.getVaultLength = () => __awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.getVaultLength().call();
        });
        this.getVaults = (id) => __awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.vaults(id).call();
        });
        this.getSignatories = (id) => __awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.getSignatories(id).call();
        });
        this.nextProposalId = (vaultId) => __awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.nextProposalId(vaultId).call();
        });
        this.getWithdrawRequest = (vaultId, proposalId) => __awaiter(this, void 0, void 0, function* () {
            return this.contract.methods.getWithdrawRequest(vaultId, proposalId).call();
        });
        this.getWithdrawRequestSigs = (vaultId, proposalId, signatoryAddress) => __awaiter(this, void 0, void 0, function* () {
            return this.contract.methods
                .getWithdrawRequestSigs(vaultId, proposalId, signatoryAddress)
                .call();
        });
        this.web3 = new web3_1.default("https://goerli.infura.io/v3/bb8c81af0ae0446f9652ca3b3ffdf2b1");
        this.initContract();
    }
}
exports.Web3Lib = Web3Lib;
//# sourceMappingURL=Web3Lib.js.map