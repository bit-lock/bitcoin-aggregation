"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputTemplate = void 0;
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
const utils_1 = require("../lib/bitcoin/utils");
const outputTemplate = (amount, balance, destinationScriptPubkey, address, fee) => {
    const first = "02";
    const balanceSats = balance * utils_1.BITCOIN_PER_SATOSHI;
    const amount64 = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(amount)).hex;
    const compactDestinationScriptPubkey = destinationScriptPubkey.substring(2);
    const changeAmountNumber = balanceSats - amount - fee;
    const changeAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(changeAmountNumber)).hex;
    const vaultScriptPubkey = lib_core_1.utils.compactSizeVarIntData((0, utils_1.createDestinationPubkey)(address).scriptPubkey);
    return first + amount64 + compactDestinationScriptPubkey + changeAmount + vaultScriptPubkey;
};
exports.outputTemplate = outputTemplate;
//# sourceMappingURL=outputs.js.map