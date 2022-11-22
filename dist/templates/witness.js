"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.witnessTemplate = void 0;
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
const innerKey = "1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624";
const witnessTemplate = (utxo, signatories, sigs, script, address) => {
    const numberOfWitnessElements = wiz_data_1.default.fromNumber(signatories[0].length + 3).hex;
    const degregadingPeriodIndex = lib_core_1.utils.compactSizeVarIntData("01");
    const scriptCompact = lib_core_1.utils.compactSizeVarIntData(script.substring(2));
    const tapTweakPrefix = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(innerKey), [wiz_data_1.default.fromHex(address.substring(2))], lib_core_1.TAPROOT_VERSION.BITCOIN).tweak.hex.substring(0, 2) === "02" ? "c0" : "c1";
    let final = "";
    utxo.forEach((ut, index) => {
        // higher -> lower
        let sigList = "";
        [...sigs].reverse().forEach((sig) => {
            if (sig[index]) {
                sigList += lib_core_1.utils.compactSizeVarIntData(sig[index].substring(2));
            }
            else {
                sigList += "00";
            }
        });
        // lower -> higher
        const data = numberOfWitnessElements + sigList + degregadingPeriodIndex + scriptCompact + "21" + tapTweakPrefix + innerKey;
        final += data;
    });
    return final + "00000000";
};
exports.witnessTemplate = witnessTemplate;
//# sourceMappingURL=witness.js.map