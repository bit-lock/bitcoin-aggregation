import Web3Lib from "./lib/Web3Lib";
import cron from "node-cron";
import { bitcoinTemplateMaker } from "./lib/bitcoin/headerTemplate";
import { bitcoinBalanceCalculation, broadcast, fetchUtxos } from "./lib/bitcoin/utils";
import { inputTemplate } from "./templates/inputs";
import { outputTemplate } from "./templates/outputs";
import { witnessTemplate } from "./templates/witness";
import express from "express";

const app = express();

app.get("/", function (req: any, res: any) {
  res.send("Welcome to bitlock aggreagation");
});

app.listen(process.env.PORT || 3001);

const main = async () => {
  const instance = new Web3Lib();

  const vaultLength = await instance.getVaultLength();

  for (let i = 41; i < vaultLength; i++) {
    const vaultId = i;
    const vault = await instance.getVaults(vaultId);

    if (vault.status === "0x01") {
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
        const withdrawRequestSigs: any = await Promise.all(getWithdrawRequestSigs);

        const signCountPerWithdrawRequest = signatories[0].length;

        withdrawRequests.forEach(async (wr: any, index: number) => {
          const currentWithdrawRequest = wr;
          const currentSigns = withdrawRequestSigs.slice(index * signCountPerWithdrawRequest, (index + 1) * signCountPerWithdrawRequest);
          const powers = signatories[1];

          const sortingPower = [...powers].sort((a, b) => Number(b) - Number(a));

          const sortingIndexs = sortingPower.map((pow) => {
            return powers.indexOf(pow);
          });

          const finalSigns: any = [];
          let votePower = 0;

          sortingIndexs.forEach((index) => {
            if (currentSigns[index].length > 0) votePower += Number(sortingPower[index]);

            finalSigns.push(currentSigns[index]);
          });

          if (votePower >= Number(vault.threshold)) {
            const inputs = inputTemplate(utxos);
            const outputs = outputTemplate(Number(currentWithdrawRequest.amount), balance, currentWithdrawRequest.scriptPubkey, address, Number(currentWithdrawRequest.fee));

            const witness = witnessTemplate(utxos, signatories, currentSigns, script);
            const rawHex = inputs + outputs + witness;
            console.log(rawHex);

            try {
              const txId = await broadcast(rawHex);
              console.log("txId ", txId);
            } catch (err: any) {
              // console.log(err);
            }
          }
        });
      }
    }
  }
};

cron.schedule("* * * * *", async () => {
  console.log("program is running");
  main();
});
// main();
