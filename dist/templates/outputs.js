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
exports.outputTemplate = void 0;
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
const utils_1 = require("../lib/bitcoin/utils");
const outputTemplate = (utxo, amount, destinationScriptPubkey, minimumSignatoryCount, script, address) => __awaiter(void 0, void 0, void 0, function* () {
    const first = "02";
    const amount64 = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(amount)).hex;
    const compactDestinationScriptPubkey = destinationScriptPubkey.substring(2);
    const balance = (0, utils_1.bitcoinBalanceCalculation)(utxo) * utils_1.BITCOIN_PER_SATOSHI;
    const fee = yield (0, utils_1.calculateTxFees)(utxo, minimumSignatoryCount, script.substring(2));
    const changeAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(balance - amount - fee)).hex;
    const destinationScriptPubkeyCompact = lib_core_1.utils.compactSizeVarIntData((0, utils_1.createDestinationPubkey)(address).scriptPubkey);
    return first + amount64 + compactDestinationScriptPubkey + changeAmount + destinationScriptPubkeyCompact;
});
exports.outputTemplate = outputTemplate;
//# sourceMappingURL=outputs.js.map