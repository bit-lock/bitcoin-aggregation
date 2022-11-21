import { convertion, utils } from "@script-wiz/lib-core";
import WizData from "@script-wiz/wiz-data";
import { BITCOIN_PER_SATOSHI, createDestinationPubkey } from "../lib/bitcoin/utils";

export const outputTemplate = (amount: number, balance: number, destinationScriptPubkey: string, address: string, fee: number) => {
  const first = "02";
  const balanceSats = balance * BITCOIN_PER_SATOSHI;

  const amount64 = convertion.numToLE64(WizData.fromNumber(amount)).hex;

  const compactDestinationScriptPubkey = destinationScriptPubkey.substring(2);

  const changeAmountNumber = balanceSats - amount - fee;

  const changeAmount = convertion.numToLE64(WizData.fromNumber(changeAmountNumber)).hex;
  const vaultScriptPubkey = utils.compactSizeVarIntData(createDestinationPubkey(address).scriptPubkey);

  return first + amount64 + compactDestinationScriptPubkey + changeAmount + vaultScriptPubkey;
};
