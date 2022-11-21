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
exports.inputTemplate = void 0;
const wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
const inputTemplate = (utxo) => {
    console.log(utxo);
    let first = "020000000001";
    let utxoArray = utxo.map((u) => {
        return (0, wiz_data_1.hexLE)(u.txId) + u.vout + "00fdffffff";
    });
    return first + wiz_data_1.default.fromNumber(utxo.length).hex + utxoArray;
};
exports.inputTemplate = inputTemplate;
//# sourceMappingURL=inputs.js.map