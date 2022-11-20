"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputTemplate = void 0;
const wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
const inputTemplate = (utxo) => {
    console.log(utxo);
    let first = "020000000001";
    let utxoArray = utxo.map((u) => {
        return u.txId + u.vout + "00fdffffff";
    });
    return first + wiz_data_1.default.fromNumber(utxo.length).hex + utxoArray;
};
exports.inputTemplate = inputTemplate;
//# sourceMappingURL=inputs.js.map