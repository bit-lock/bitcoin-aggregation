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
const node_cron_1 = __importDefault(require("node-cron"));
const headerTemplate_1 = require("./lib/bitcoin/headerTemplate");
const utils_1 = require("./lib/bitcoin/utils");
const inputs_1 = require("./templates/inputs");
const outputs_1 = require("./templates/outputs");
const witness_1 = require("./templates/witness");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/", function (req, res) {
    res.send("Welcome to bitlock aggreagation");
});
app.listen(process.env.PORT || 3001);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const instance = new Web3Lib_1.default();
    const vaultLength = yield instance.getVaultLength();
    for (let i = 39; i < vaultLength; i++) {
        const vaultId = i;
        const vault = yield instance.getVaults(vaultId);
        if (vault.status === "0x01") {
            const signatories = yield instance.getSignatories(i);
            const nextProposalId = yield instance.nextProposalId(vaultId);
            const { address, script } = (0, headerTemplate_1.bitcoinTemplateMaker)(Number(vault.threshold), signatories);
            const utxos = yield (0, utils_1.fetchUtxos)(address);
            const balance = (0, utils_1.bitcoinBalanceCalculation)(utxos);
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
                const signCountPerWithdrawRequest = signatories[0].length;
                withdrawRequests.forEach((wr, index) => __awaiter(void 0, void 0, void 0, function* () {
                    const currentWithdrawRequest = wr;
                    const currentSigns = withdrawRequestSigs.slice(index * signCountPerWithdrawRequest, (index + 1) * signCountPerWithdrawRequest);
                    const powers = signatories[1];
                    const sortingPower = [...powers].sort((a, b) => Number(b) - Number(a));
                    const sortingIndexs = sortingPower.map((pow) => {
                        return powers.indexOf(pow);
                    });
                    const finalSigns = [];
                    let votePower = 0;
                    sortingIndexs.forEach((index) => {
                        if (currentSigns[index].length > 0)
                            votePower += Number(sortingPower[index]);
                        finalSigns.push(currentSigns[index]);
                    });
                    if (votePower >= Number(vault.threshold)) {
                        const inputs = (0, inputs_1.inputTemplate)(utxos);
                        const outputs = (0, outputs_1.outputTemplate)(Number(currentWithdrawRequest.amount), balance, currentWithdrawRequest.scriptPubkey, address, Number(currentWithdrawRequest.fee));
                        const witness = (0, witness_1.witnessTemplate)(utxos, signatories, currentSigns, script);
                        const rawHex = inputs + outputs + witness;
                        console.log(rawHex);
                        try {
                            const txId = yield (0, utils_1.broadcast)(rawHex);
                            console.log("txId ", txId);
                        }
                        catch (err) {
                            // console.log(err);
                        }
                    }
                }));
            }
        }
    }
});
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("program is running");
    main();
}));
// main();
//# sourceMappingURL=index.js.map