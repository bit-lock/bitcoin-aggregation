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
    for (let i = 0; i < vaultLength; i++) {
        const vaultId = i;
        const vault = yield instance.getVaults(vaultId);
        if (vault.status === "0x01") {
            const signatories = yield instance.getSignatories(i);
            const nextProposalId = yield instance.nextProposalId(vaultId);
            let propsalIds = [];
            if (nextProposalId > 0) {
                for (let z = 0; z < nextProposalId; z++) {
                    propsalIds.push(z);
                }
            }
            if (propsalIds.length > 0) {
                let getWithdrawRequestPromises = [];
                let getWithdrawRequestSigs = [];
                propsalIds.forEach((ppId) => {
                    getWithdrawRequestPromises.push(instance.getWithdrawRequest(vaultId, ppId));
                    signatories[0].forEach((address) => {
                        getWithdrawRequestSigs.push(instance.getWithdrawRequestSigs(vaultId, ppId, address));
                    });
                });
                const withdrawRequests = yield Promise.all(getWithdrawRequestPromises);
                const withdrawRequestSigs = yield Promise.all(getWithdrawRequestSigs);
                //
                const signatoriesNumber = signatories[1].map((sg) => Number(sg));
                console.log(signatoriesNumber.sort((a, b) => b - a));
            }
        }
    }
});
main();
// cron.schedule("* * * * * *", async () => {});
//# sourceMappingURL=index.js.map