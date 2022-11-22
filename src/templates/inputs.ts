import WizData, { hexLE } from "@script-wiz/wiz-data";
import { UTXO } from "../lib/models/UTXO";

export const inputTemplate = (utxo: UTXO[]) => {
  let first = "020000000001";
  let utxoData = "";

  utxo.forEach((u) => {
    utxoData += hexLE(u.txId) + u.vout + "0000000000";
  });

  return first + WizData.fromNumber(utxo.length).hex + utxoData;
};
