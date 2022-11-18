"use strict";
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
const Web3Lib_1 = require("./lib/Web3Lib");
const node_cron_1 = __importDefault(require("node-cron"));
class WebLib {
    constructor() {
        this.getLib = () => {
            return this.webLib3;
        };
        this.webLib3 = new Web3Lib_1.Web3Lib();
    }
    static getInstance() {
        if (!WebLib.instance) {
            WebLib.instance = new WebLib();
        }
        return WebLib.instance;
    }
}
node_cron_1.default.schedule("* * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("calisti");
    const bisey = new WebLib();
    const instance = bisey.getLib();
    instance.getVaultLength();
    console.log(yield instance.getVaultLength());
}));
//# sourceMappingURL=index.js.map