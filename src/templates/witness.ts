import { utils } from "@script-wiz/lib-core";
import WizData from "@script-wiz/wiz-data";
import { Signatories } from "../lib/models/Signatories";

export const witnessTemplate = (signatories: Signatories, sigs: string[], script: string) => {
  const numberOfWitnessElements = WizData.fromNumber(signatories[0].length + 3).hex;
  const degregadingPeriodIndex = utils.compactSizeVarIntData("01");

  const scriptCompact = utils.compactSizeVarIntData(script.substring(2));

  const signatory =
    numberOfWitnessElements +
    utils.compactSizeVarIntData(sigs[1][0].substring(2)) +
    utils.compactSizeVarIntData(sigs[0][0].substring(2)) +
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

  return signatory + "00000000";
};
