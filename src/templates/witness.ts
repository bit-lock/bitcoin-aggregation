import { utils } from "@script-wiz/lib-core";
import WizData from "@script-wiz/wiz-data";
import { Signatories } from "../lib/models/Signatories";
import { UTXO } from "../lib/models/UTXO";

export const witnessTemplate = (utxo: UTXO[], signatories: Signatories, sigs: string[], script: string) => {
  const numberOfWitnessElements = WizData.fromNumber(signatories[0].length + 3).hex;
  const degregadingPeriodIndex = utils.compactSizeVarIntData("01");

  const scriptCompact = utils.compactSizeVarIntData(script.substring(2));
  let final = "";

  utxo.forEach((ut, index) => {
    // higher -> lower

    let sigList = "";

    [...sigs].reverse().forEach((sig, i) => {
      console.log("iç", i, sig);
      sigList += utils.compactSizeVarIntData(sig[index].substring(2));
    });

    // lower -> higher
    const data = numberOfWitnessElements + sigList + degregadingPeriodIndex + scriptCompact + "21" + "c0" + "1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624";

    final += data;
  });

  return final + "00000000";
};
