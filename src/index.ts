import Web3Lib from "./lib/Web3Lib";
import cron from "node-cron";
import { bitcoinTemplateMaker } from "./lib/bitcoin/headerTemplate";
import { bitcoinBalanceCalculation, fetchUtxos } from "./lib/bitcoin/utils";
import { inputTemplate } from "./templates/inputs";
import { outputTemplate } from "./templates/outputs";
import { witnessTemplate } from "./templates/witness";

const main = async () => {
  const instance = new Web3Lib();

  const vaultLength = await instance.getVaultLength();

  for (let i = 0; i < vaultLength; i++) {
    const vaultId = i;
    const vault = await instance.getVaults(vaultId);

    if (vault.status === "0x01" && vault.name === "burki") {
      const signatories = await instance.getSignatories(i);
      const nextProposalId = await instance.nextProposalId(vaultId);

      const { address, script } = bitcoinTemplateMaker(Number(vault.threshold), signatories);

      const utxos = await fetchUtxos(address);
      const balance = bitcoinBalanceCalculation(utxos);

      let propsalIds = [];

      if (nextProposalId > 0) {
        for (let z = 0; z < nextProposalId; z++) {
          propsalIds.push(z);
        }
      }

      if (propsalIds.length > 0) {
        let getWithdrawRequestPromises: any = [];
        let getWithdrawRequestSigs: any = [];

        propsalIds.forEach((ppId) => {
          getWithdrawRequestPromises.push(instance.getWithdrawRequest(vaultId, ppId));

          signatories[0].forEach((address) => {
            getWithdrawRequestSigs.push(instance.getWithdrawRequestSigs(vaultId, ppId, address));
          });
        });

        const withdrawRequests: any = await Promise.all(getWithdrawRequestPromises);
        const withdrawRequestSigs: string[] = await Promise.all(getWithdrawRequestSigs);

        // console.log(signatoriesNumber.sort((a, b) => b - a));
        // console.log(withdrawRequests);
        // console.log(withdrawRequestSigs);

        console.log("ww", withdrawRequests);
        console.log("withdrawRequestSigs", withdrawRequestSigs);

        console.log("script", script);

        const a = inputTemplate(utxos);
        const b = outputTemplate(Number(withdrawRequests[0].amount), balance, withdrawRequests[0].scriptPubkey, address, Number(withdrawRequests[0].fee));
        const c = witnessTemplate(signatories, withdrawRequestSigs, script);

        console.log("inputs", a);
        console.log("outputs", b);
        console.log("witness", c);
        console.log(a + b + c);
      }
    }
  }
};

main();

// cron.schedule("* * * * * *", async () => {});
