"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPreimages = exports.calculateShaOutputs = exports.calculateShaSequences = exports.calculateScriptPubkeys = exports.calculateShaAmounts = exports.calculatePrevouts = exports.calculateSighashPreimage = void 0;
const wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
const lib_core_1 = require("@script-wiz/lib-core");
const utils_1 = require("./utils");
// amount satoshi
const calculateSighashPreimage = (utxoSet, feeGap, vaultAddress, destinationScriptPubkey, amount, script) => {
    const sighashPreimage = [];
    let hasChange = true;
    const { scriptPubkey: vaultScriptPubkey } = (0, utils_1.createDestinationPubkey)(vaultAddress);
    if (feeGap < 1000) {
        hasChange = false;
    }
    utxoSet.forEach((utxo, index) => {
        let value = "";
        value += "00000200000000000000";
        // console.log("1", value);
        value += (0, exports.calculatePrevouts)(utxoSet); //sha prevouts
        // console.log("2", calculatePrevouts(utxoSet));
        value += (0, exports.calculateShaAmounts)(utxoSet); //prevvaules
        // console.log("3", calculateShaAmounts(utxoSet));
        value += (0, exports.calculateScriptPubkeys)(utxoSet, vaultScriptPubkey); // sha prevscriptpubkeys
        // console.log("4", calculateScriptPubkeys(utxoSet, vaultScriptPubkey));
        value += (0, exports.calculateShaSequences)(utxoSet); // sha sequences
        // console.log("5", calculateShaSequences(utxoSet));
        value += (0, exports.calculateShaOutputs)(feeGap, hasChange, vaultScriptPubkey, destinationScriptPubkey, amount); //sha outs
        // console.log("6", calculateShaOutputs(feeGap, hasChange, vaultScriptPubkey, destinationScriptPubkey, amount));
        value += "02"; //spend type
        // console.log("7", "02");
        value += lib_core_1.convertion.convert32(wiz_data_1.default.fromNumber(index)).hex; // input index
        // console.log("8", convertion.convert32(WizData.fromNumber(index)).hex);
        value += lib_core_1.taproot.tapLeaf(wiz_data_1.default.fromHex(script), "c0"); //tapleaf
        // console.log("9", taproot.tapLeaf(WizData.fromHex(script), "c0"));
        value += "00"; //key version
        // console.log("10", "00");
        value += "ffffffff"; //codesep position
        // console.log("11", "ffffffff");
        sighashPreimage.push(value);
    });
    // console.log("sighashPreimage", sighashPreimage);
    return sighashPreimage;
};
exports.calculateSighashPreimage = calculateSighashPreimage;
const calculatePrevouts = (utxoSet) => {
    let hashInputs = "";
    utxoSet.forEach((input) => {
        const vout = lib_core_1.convertion.numToLE32(wiz_data_1.default.fromNumber(Number(input.vout))).hex;
        hashInputs += wiz_data_1.default.fromHex((0, wiz_data_1.hexLE)(input.txId) + vout).hex;
    });
    // console.log("prevouts", hashInputs);
    return lib_core_1.crypto.sha256(wiz_data_1.default.fromHex(hashInputs)).toString();
};
exports.calculatePrevouts = calculatePrevouts;
const calculateShaAmounts = (utxoSet) => {
    let inputAmounts = "";
    utxoSet.forEach((input) => {
        inputAmounts += lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(Number(input.value) * 100000000)).hex;
    });
    // console.log("sha amoutns", inputAmounts);
    return lib_core_1.crypto.sha256(wiz_data_1.default.fromHex(inputAmounts)).toString();
};
exports.calculateShaAmounts = calculateShaAmounts;
const calculateScriptPubkeys = (utxoSet, scriptPubkey) => {
    let inputScriptPubkeys = "";
    utxoSet.forEach(() => {
        inputScriptPubkeys += lib_core_1.utils.compactSizeVarIntData(scriptPubkey);
    });
    // console.log("script pub keys", inputScriptPubkeys);
    return lib_core_1.crypto.sha256(wiz_data_1.default.fromHex(inputScriptPubkeys)).toString();
};
exports.calculateScriptPubkeys = calculateScriptPubkeys;
const calculateShaSequences = (utxoSet) => {
    let inputSequences = "";
    utxoSet.forEach(() => {
        inputSequences += "01000000";
    });
    // console.log("sequences", inputSequences);
    return lib_core_1.crypto.sha256(wiz_data_1.default.fromHex(inputSequences)).toString();
};
exports.calculateShaSequences = calculateShaSequences;
const calculateShaOutputs = (feeGap, hasChange, vaultScriptPubkey, destinationScriptPubkey, amount) => {
    let outputs = "";
    const destinationAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(Number(amount))).hex;
    outputs += destinationAmount;
    outputs += lib_core_1.utils.compactSizeVarIntData(destinationScriptPubkey);
    if (hasChange) {
        const feeGapAmount = lib_core_1.convertion.numToLE64(wiz_data_1.default.fromNumber(Number(feeGap))).hex;
        outputs += feeGapAmount;
        outputs += lib_core_1.utils.compactSizeVarIntData(vaultScriptPubkey);
    }
    // console.log("line 100 : ", outputs);
    return lib_core_1.crypto.sha256(wiz_data_1.default.fromHex(outputs)).toString();
};
exports.calculateShaOutputs = calculateShaOutputs;
const signPreimages = (privateKey, preImages) => {
    const signs = preImages.map((preImage) => {
        return lib_core_1.crypto.schnorrSign(wiz_data_1.default.fromHex(preImage), wiz_data_1.default.fromHex(privateKey)).sign.hex;
    });
    return signs;
};
exports.signPreimages = signPreimages;
//# sourceMappingURL=preimagecalc.js.map