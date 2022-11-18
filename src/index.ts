import Web3Lib from "./lib/Web3Lib";
import cron from "node-cron";
import { VaultContract } from "./lib/models/VaultContract";
import { Signatories } from "./lib/models/Signatories";

const main = async () => {
  const instance = new Web3Lib();
  const vaultLength = await instance.getVaultLength();
  let getVaultsPromises = [];
  let getSignatoriesPromises = [];

  for (let i = 0; i < vaultLength; i++) {
    getVaultsPromises.push(instance.getVaults(i));
    getSignatoriesPromises.push(instance.getSignatories(i));
  }

  const vaults = await Promise.all(getVaultsPromises);
  const signatories = await Promise.all(getSignatoriesPromises);

  let step1: { id: number; vault: VaultContract; signatory: Signatories; propsalIds: number[]; withdrawRequests: any; withdrawSigs: string[] }[] = [];

  vaults.forEach((vault, index) => {
    if (vault.status === "0x01") {
      step1.push({ id: index, vault, signatory: signatories[index], propsalIds: [], withdrawRequests: [], withdrawSigs: [] });
    }
  });

  const proposalIdPromises = step1.map((data) => instance.nextProposalId(data.id));

  const nextProposalIds = await Promise.all(proposalIdPromises);
  const proposalIds = nextProposalIds.map((id) => id - 1);

  step1.forEach((s, index) => {
    if (proposalIds[index] > -1) {
      let ppIds = [];

      for (let z = 0; z < nextProposalIds[index]; z++) {
        ppIds.push(z);
      }

      let clonedStep1 = [...step1];
      clonedStep1[index].propsalIds = ppIds;
      step1 = clonedStep1;
    }
  });

  let getWithdrawRequestPromises: any = [];
  let getWithdrawRequestSigs: any = [];

  step1.forEach((st) => {
    st.propsalIds.forEach((ppId) => {
      getWithdrawRequestPromises.push(instance.getWithdrawRequest(st.id, ppId));

      st.signatory[0].forEach((address) => {
        getWithdrawRequestSigs.push(instance.getWithdrawRequestSigs(st.id, ppId, address));
      });
    });
  });

  const withdrawRequests: any = await Promise.all(getWithdrawRequestPromises);
  const withdrawRequestSigs: string[][] = await Promise.all(getWithdrawRequestSigs);

  step1.forEach((st, index1) => {
    let clonedStep1 = [...step1];

    st.propsalIds.forEach((a, index2) => {
      clonedStep1[index1].withdrawRequests = [...withdrawRequests[index1 + index2]];

      st.signatory[0].forEach((address, index3) => {
        clonedStep1[index1].withdrawSigs = withdrawRequestSigs[index1 + index2 + index3];
      });
    });

    step1 = clonedStep1;
  });

  console.log(step1);

  // let optimal_signatures_array = [];
  // console.log("1", withdrawRequests);

  // // withdraw işlemi imzaları
  // console.log("2", withdrawRequestSigs);
};

main();

// cron.schedule("* * * * * *", async () => {});
