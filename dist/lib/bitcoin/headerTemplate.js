"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitcoinTemplateMaker = void 0;
const lib_1 = require("@script-wiz/lib");
const lib_core_1 = require("@script-wiz/lib-core");
const wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
const bitcoinTemplateMaker = (unlocking_threshold, signatories) => {
    const vm = { network: lib_1.VM_NETWORK.BTC, ver: lib_1.VM_NETWORK_VERSION.TAPSCRIPT };
    const scriptWizard = new lib_1.ScriptWiz(vm);
    noDegradeHeader(scriptWizard, unlocking_threshold);
    body(scriptWizard, signatories);
    footer(scriptWizard);
    const script = scriptWizard.compile();
    const innerkey = "1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624";
    const result = lib_core_1.taproot.tapRoot(wiz_data_1.default.fromHex(innerkey), [wiz_data_1.default.fromHex(script.substring(2))], lib_core_1.TAPROOT_VERSION.BITCOIN);
    return { script, address: result.address.testnet };
};
exports.bitcoinTemplateMaker = bitcoinTemplateMaker;
const noDegradeHeader = (scriptWizard, unlocking_threshold) => {
    scriptWizard.parseOpcode("OP_DUP", false, "");
    scriptWizard.parseOpcode("OP_1", false, "");
    scriptWizard.parseOpcode("OP_EQUAL", false, "");
    scriptWizard.parseOpcode("OP_IF", false, "");
    scriptWizard.parseOpcode("OP_DROP", false, "");
    scriptWizard.parseOpcode("OP_0", false, "");
    scriptWizard.parseOpcode("OP_CHECKSEQUENCEVERIFY", false, "");
    scriptWizard.parseOpcode("OP_DROP", false, "");
    scriptWizard.parseNumber(unlocking_threshold, true, "");
    scriptWizard.parseOpcode("OP_TOALTSTACK", false, "");
    scriptWizard.parseOpcode("OP_ELSE", false, "");
    scriptWizard.parseOpcode("OP_RETURN", false, "");
    scriptWizard.parseOpcode("OP_ENDIF", false, "");
    scriptWizard.parseOpcode("OP_0", false, "");
    scriptWizard.parseOpcode("OP_TOALTSTACK", false, "");
};
const body = (scriptWizard, signatories) => {
    const loopIndex = signatories[0].length;
    for (let index = 0; index < loopIndex; index++) {
        scriptWizard.parseHex(signatories[2][index].substring(2), true, "");
        scriptWizard.parseOpcode("OP_CHECKSIG", false, "");
        scriptWizard.parseOpcode("OP_IF", false, "");
        scriptWizard.parseNumber(Number(signatories[1][index]), true, "");
        scriptWizard.parseOpcode("OP_ELSE", false, "");
        scriptWizard.parseOpcode("OP_0", false, "");
        scriptWizard.parseOpcode("OP_ENDIF", false, "");
        scriptWizard.parseOpcode("OP_FROMALTSTACK", false, "");
        scriptWizard.parseOpcode("OP_ADD", false, "");
        scriptWizard.parseOpcode("OP_TOALTSTACK", false, "");
    }
};
const footer = (scriptWizard) => {
    scriptWizard.parseOpcode("OP_FROMALTSTACK", false, "");
    scriptWizard.parseOpcode("OP_FROMALTSTACK", false, "");
    scriptWizard.parseOpcode("OP_GREATERTHANOREQUAL", false, "");
};
//# sourceMappingURL=headerTemplate.js.map