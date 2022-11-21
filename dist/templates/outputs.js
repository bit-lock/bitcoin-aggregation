"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputTemplate = void 0;
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
const utils_1 = require("../lib/bitcoin/utils");
const outputTemplate = (amount, destinationScriptPubkey, address, fee) => {
    const first = "02";
    const amount64 = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(amount)).hex;
    console.log("1", destinationScriptPubkey);
    const compactDestinationScriptPubkey = destinationScriptPubkey.substring(2);
    // const fee = await calculateTxFees(utxo, minimumSignatoryCount, script.substring(2));
    const changeAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(fee)).hex;
    const destinationScriptPubkeyCompact = lib_core_1.utils.compactSizeVarIntData((0, utils_1.createDestinationPubkey)(address).scriptPubkey);
    console.log("2", destinationScriptPubkeyCompact);
    return first + amount64 + compactDestinationScriptPubkey + changeAmount + destinationScriptPubkeyCompact;
};
exports.outputTemplate = outputTemplate;
//# sourceMappingURL=outputs.js.map