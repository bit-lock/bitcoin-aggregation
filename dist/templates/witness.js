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
exports.witnessTemplate = void 0;
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
const witnessTemplate = (signatories, sigs, script) => {
    const numberOfWitnessElements = wiz_data_1.default.fromNumber(signatories[0].length + 3).hex;
    const degregadingPeriodIndex = lib_core_1.utils.compactSizeVarIntData("01");
    const scriptCompact = lib_core_1.utils.compactSizeVarIntData(script.substring(2));
    const signatury = numberOfWitnessElements +
        (0, wiz_data_1.hexLE)(lib_core_1.utils.compactSizeVarIntData(sigs[0][0].substring(2))) +
        (0, wiz_data_1.hexLE)(lib_core_1.utils.compactSizeVarIntData(sigs[1][0].substring(2))) +
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