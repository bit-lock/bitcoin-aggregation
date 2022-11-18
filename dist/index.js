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
const Web3Lib_1 = __importDefault(require("./lib/Web3Lib"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const instance = new Web3Lib_1.default();
    const vaultLength = yield instance.getVaultLength();
    let getVaultsPromises = [];
    let getSignatoriesPromises = [];
    for (let i = 0; i < vaultLength; i++) {
        getVaultsPromises.push(instance.getVaults(i));
        getSignatoriesPromises.push(instance.getSignatories(i));
    }
    const vaults = yield Promise.all(getVaultsPromises);
    const signatories = yield Promise.all(getSignatoriesPromises);
    let step1 = [];
    vaults.forEach((vault, index) => {
        if (vault.status === "0x01") {
            step1.push({ id: index, vault, signatory: signatories[index], propsalIds: [], withdrawRequests: [], withdrawSigs: [] });
        }
    });
    const proposalIdPromises = step1.map((data) => instance.nextProposalId(data.id));
    const nextProposalIds = yield Promise.all(proposalIdPromises);
    const proposalIds = nextProposalIds.map((id) => id - 1);
    step1.forEach((s, index) => {
        if (proposalIds[index] > -1) {
            let ppIds = [];
            for (let z = 0; z < nextProposalIds[index]; z++) {
                ppIds.push(z);
            }
            let clonedStep1 = [...step1];
            clonedStep1[index].propsalIds = ppIds;
            step1 = clonedStep1;
        }
    });
    let getWithdrawRequestPromises = [];
    let getWithdrawRequestSigs = [];
    step1.forEach((st) => {
        st.propsalIds.forEach((ppId) => {
            getWithdrawRequestPromises.push(instance.getWithdrawRequest(st.id, ppId));
            st.signatory[0].forEach((address) => {
                getWithdrawRequestSigs.push(instance.getWithdrawRequestSigs(st.id, ppId, address));
            });
        });
    });
    const withdrawRequests = yield Promise.all(getWithdrawRequestPromises);
    const withdrawRequestSigs = yield Promise.all(getWithdrawRequestSigs);
    step1.forEach((st, index1) => {
        let clonedStep1 = [...step1];
        st.propsalIds.forEach((a, index2) => {
            clonedStep1[index1].withdrawRequests = [...withdrawRequests[index1 + index2]];
            st.signatory[0].forEach((address, index3) => {
                clonedStep1[index1].withdrawSigs = withdrawRequestSigs[index1 + index2 + index3];
            });
        });
        step1 = clonedStep1;
    });
    console.log(step1);
    // let optimal_signatures_array = [];
    // console.log("1", withdrawRequests);
    // // withdraw işlemi imzaları
    // console.log("2", withdrawRequestSigs);
});
main();
// cron.schedule("* * * * * *", async () => {});
//# sourceMappingURL=index.js.map