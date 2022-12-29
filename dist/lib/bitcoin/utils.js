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
exports.broadcast = exports.BITCOIN_PER_SATOSHI = exports.convertTo35Byte = exports.lexicographical = exports.bitcoinBalanceCalculation = exports.createDestinationPubkey = exports.calculateTxFees = exports.fetchUtxos = void 0;
const axios_1 = __importDefault(require("axios"));
const wiz_data_1 = __importStar(require("@script-wiz/wiz-data"));
const esplora_api_client_1 = require("@bitmatrix/esplora-api-client");
const lib_core_1 = require("@script-wiz/lib-core");
const bs58_1 = require("bs58");
// @ts-ignore
const segwit_addr_ecc_1 = __importDefault(require("./bech32/segwit_addr_ecc"));
const recomommendedFee = () => __awaiter(void 0, void 0, void 0, function* () {
    return axios_1.default.get("https://mempool.space/api/v1/fees/recommended").then((response) => {
        return response.data;
    });
});
const fetchUtxos = (address) => __awaiter(void 0, void 0, void 0, function* () {
    (0, esplora_api_client_1.init)("https://blockstream.info/testnet/api");
    let myUtxoSets = [];
    let allTxs = [];
    try {
        allTxs = yield esplora_api_client_1.esploraClient.addressTxs(address);
    }
    catch (err) {
        console.log(err);
    }
    const confirmedTxs = allTxs;
    if (confirmedTxs.length > 0) {
        const myPromises = confirmedTxs.map((tx) => {
            return esplora_api_client_1.esploraClient.txOutspends(tx.txid);
        });
        return Promise.all(myPromises).then((myProm) => {
            myProm.forEach((os, index) => {
                const tx = confirmedTxs[index];
                const unSpentIndexs = os
                    .map((outspend, index) => {
                    if (!outspend.spent) {
                        return index;
                    }
                })
                    .filter((dt) => dt !== undefined);
                if (unSpentIndexs.length > 0) {
                    unSpentIndexs.forEach((us) => {
                        if (us !== undefined) {
                            if (tx.vout[us].scriptpubkey_address === address) {
                                myUtxoSets.push({
                                    txId: tx.txid,
                                    vout: lib_core_1.convertion.convert32(wiz_data_1.default.fromNumber(us)).hex,
                                    value: (tx.vout[us].value || 0) / 100000000,
                                });
                            }
                        }
                    });
                }
            });
            const myFinalUtxos = myUtxoSets.map((value, index) => {
                return {
                    data: lib_core_1.crypto.sha256v2(wiz_data_1.default.fromHex(value.txId + value.vout)),
                    index,
                };
            });
            const sortedUtxos = myFinalUtxos.sort((a, b) => (0, exports.lexicographical)(a.data, b.data));
            const finalData = sortedUtxos.map((data) => myUtxoSets[data.index]);
            return finalData;
        });
    }
    return myUtxoSets;
});
exports.fetchUtxos = fetchUtxos;
const calculateTxFees = (utxos, minimumSignatoryCount, template) => __awaiter(void 0, void 0, void 0, function* () {
    const totalUtxoCount = utxos.length;
    const templateByteSize = wiz_data_1.default.fromHex(template).bytes.byteLength;
    const fee = yield recomommendedFee();
    const formula = (40 * totalUtxoCount + 16 * totalUtxoCount * minimumSignatoryCount + 10 + 8 + (templateByteSize * totalUtxoCount) / 4 + 87) * fee.fastestFee;
    return Math.round(formula) + 10;
});
exports.calculateTxFees = calculateTxFees;
const createDestinationPubkey = (destinationAddress) => {
    if (destinationAddress === "")
        return { errorMessage: "", scriptPubkey: "" };
    const res = segwit_addr_ecc_1.default.check2(destinationAddress, ["bc", "tb"]);
    let scriptPubkey = "";
    try {
        if (res.program) {
            const result = res.program
                .map((byte) => {
                return ("0" + (byte & 0xff).toString(16)).slice(-2);
            })
                .join("");
            const versionPrefix = res.version === 1 ? "51" : "00";
            scriptPubkey = versionPrefix + lib_core_1.utils.compactSizeVarIntData(result);
        }
        else {
            const data = (0, bs58_1.decode)(destinationAddress);
            if (data.byteLength === 25) {
                const editedData = data.slice(1, 21);
                const validData = data.slice(0, 21);
                const editedDataDoubleHash = lib_core_1.crypto.hash256(wiz_data_1.default.fromBytes(validData)).toString();
                const doubleHashFirst4Byte = editedDataDoubleHash.substring(0, 8);
                const dataLast4byte = Buffer.from(data.slice(21)).toString("hex");
                if (doubleHashFirst4Byte === dataLast4byte) {
                    if (data[0] === 111 || data[0] === 0) {
                        scriptPubkey = "76a914" + Buffer.from(editedData).toString("hex") + "88ac";
                    }
                    else if (data[0] === 196 || data[0] === 5) {
                        scriptPubkey = "a914" + Buffer.from(editedData).toString("hex") + "87";
                    }
                    else {
                        return { errorMessage: "Invalid address", scriptPubkey: "" };
                    }
                }
                else {
                    return { errorMessage: "Invalid address", scriptPubkey: "" };
                }
            }
            else {
                return { errorMessage: "Invalid address", scriptPubkey: "" };
            }
        }
    }
    catch (_a) {
        return { errorMessage: "Invalid address", scriptPubkey: "" };
    }
    return { errorMessage: "", scriptPubkey };
};
exports.createDestinationPubkey = createDestinationPubkey;
const bitcoinBalanceCalculation = (utxos) => {
    if (utxos.length > 0) {
        const balances = utxos.map((utxo) => utxo.value);
        const initialValue = 0;
        return balances.reduce((previousValue, currentValue) => previousValue + currentValue, initialValue);
    }
    return 0;
};
exports.bitcoinBalanceCalculation = bitcoinBalanceCalculation;
const lexicographical = (aTx, bTx) => {
    if (aTx.length !== 64 || bTx.length !== 64)
        throw new Error("Lexicographical error. Wrong length tx ids: " + aTx + "," + bTx);
    const a = (0, wiz_data_1.hexLE)(aTx.substring(48));
    const b = (0, wiz_data_1.hexLE)(bTx.substring(48));
    return lib_core_1.arithmetics64.greaterThan64(wiz_data_1.default.fromHex(a), wiz_data_1.default.fromHex(b)).number === 1 ? 1 : -1;
};
exports.lexicographical = lexicographical;
const convertTo35Byte = (hex) => {
    const hexByteLegth = hex.length / 2;
    return hex + "00".repeat(35 - hexByteLegth);
};
exports.convertTo35Byte = convertTo35Byte;
exports.BITCOIN_PER_SATOSHI = 100000000;
const broadcast = (hex) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = {
        "Content-Type": "text/plain;charset=utf-8",
    };
    return axios_1.default
        .post("https://blockstream.info/testnet/api/tx", hex, {
        headers,
    })
        .then((response) => {
        return response.data;
    });
});
exports.broadcast = broadcast;
//# sourceMappingURL=utils.js.map