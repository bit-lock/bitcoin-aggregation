"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.witnessTemplate = void 0;
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
const witnessTemplate = (signatories, sigs, script) => {
    const numberOfWitnessElements = wiz_data_1.default.fromNumber(signatories[0].length + 3).hex;
    const degregadingPeriodIndex = lib_core_1.utils.compactSizeVarIntData("01");
    const scriptCompact = lib_core_1.utils.compactSizeVarIntData(script.substring(2));
    const signatury = numberOfWitnessElements +
        lib_core_1.utils.compactSizeVarIntData(sigs[1][0].substring(2)) +
        lib_core_1.utils.compactSizeVarIntData(sigs[0][0].substring(2)) +
        degregadingPeriodIndex +
        scriptCompact +
        "21" +
        "c1" +
        "1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624";
    // const signatury2 =
    //   numberOfWitnessElements +
    //   utils.compactSizeVarIntData(sigs[1][0].substring(2)) +
    //   degregadingPeriodIndex +
    //   scriptCompact +
    //   "21" +
    //   "c1" +
    //   "1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624";
    return signatury + "00000000";
};
exports.witnessTemplate = witnessTemplate;
//# sourceMappingURL=witness.js.map