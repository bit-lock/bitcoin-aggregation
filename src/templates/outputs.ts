import { convertion, utils } from "@script-wiz/lib-core";
import WizData from "@script-wiz/wiz-data";
import { bitcoinBalanceCalculation, BITCOIN_PER_SATOSHI, calculateTxFees, createDestinationPubkey } from "../lib/bitcoin/utils";
import { UTXO } from "../lib/models/UTXO";

export const outputTemplate = async (utxo: UTXO[], amount: number, destinationScriptPubkey: string, minimumSignatoryCount: number, script: string, address: string) => {
  const first = "02";
  const amount64 = convertion.numToLE64(WizData.fromNumber(amount)).hex;
  const compactDestinationScriptPubkey = destinationScriptPubkey.substring(2);
  const balance = bitcoinBalanceCalculation(utxo) * BITCOIN_PER_SATOSHI;

  const fee = await calculateTxFees(utxo, minimumSignatoryCount, script.substring(2));
  const changeAmount = convertion.numToLE64(WizData.fromNumber(balance - amount - fee)).hex;
  const destinationScriptPubkeyCompact = utils.compactSizeVarIntData(createDestinationPubkey(address).scriptPubkey);

  return first + amount64 + compactDestinationScriptPubkey + changeAmount + destinationScriptPubkeyCompact;
};
