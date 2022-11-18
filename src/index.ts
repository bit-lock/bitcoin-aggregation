import Web3Lib from "./lib/Web3Lib";
import cron from "node-cron";

class WebLib {
  private webLib3: Web3Lib;
  private static instance: WebLib;

  constructor() {
    this.webLib3 = new Web3Lib();
  }

  public static getInstance(): WebLib {
    if (!WebLib.instance) {
      WebLib.instance = new WebLib();
    }

    return WebLib.instance;
  }

  getLib = () => {
    return this.webLib3;
  };
}

cron.schedule("* * * * * *", async () => {
  const bisey = new WebLib();
  const instance = bisey.getLib();
  instance.getVaultLength();
  console.log(await instance.getVaultLength());
});
