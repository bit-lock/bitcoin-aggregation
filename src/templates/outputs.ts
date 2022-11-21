import { convertion, utils } from "@script-wiz/lib-core";
import WizData from "@script-wiz/wiz-data";
import { createDestinationPubkey } from "../lib/bitcoin/utils";

export const outputTemplate = (amount: number, destinationScriptPubkey: string, address: string, fee: number) => {
  const first = "02";
  const amount64 = convertion.numToLE64(WizData.fromNumber(amount)).hex;

  const compactDestinationScriptPubkey = destinationScriptPubkey.substring(2);

  // const fee = await calculateTxFees(utxo, minimumSignatoryCount, script.substring(2));
  const changeAmount = convertion.numToLE64(WizData.fromNumber(fee)).hex;
  const vaultScriptPubkey = utils.compactSizeVarIntData(createDestinationPubkey(address).scriptPubkey);

  return first + amount64 + compactDestinationScriptPubkey + changeAmount + vaultScriptPubkey;
};
