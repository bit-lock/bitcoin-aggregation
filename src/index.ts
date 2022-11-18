import Web3Lib from "./lib/Web3Lib";
import cron from "node-cron";

const main = async () => {
  const instance = new Web3Lib();

  const vaultLength = await instance.getVaultLength();

  for (let i = 0; i < vaultLength; i++) {
    const vaultId = i;
    const vault = await instance.getVaults(vaultId);

    if (vault.status === "0x01") {
      const signatories = await instance.getSignatories(i);
      const nextProposalId = await instance.nextProposalId(vaultId);
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

        //
        const signatoriesNumber = signatories[1].map((sg) => Number(sg));
        console.log(signatoriesNumber.sort((a, b) => b - a));
      }
    }
  }
};

main();

// cron.schedule("* * * * * *", async () => {});
