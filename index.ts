import { NowRequest, NowResponse } from "@now/node";
import Eth from "web3-eth";

export default async function(req: NowRequest, res: NowResponse) {
  const eth = new Eth(Eth.givenProvider || process.env.ETHNODE_MAINNET);

  const { d } = req.query;

  const standardNames = [
    "melontoken",
    "version",
    "registry",
    "fundfactory",
    "kyberpricefeed",
    "engine",
    "engineadapter",
    "ethfinexadapter",
    "kyberadapter",
    "matchingmarketadapter",
    "zeroexv2adapter",
    "fundranking",
    "managementfee",
    "performancefee"
  ];

  const names = d && typeof d === "string" ? d.split(",") : standardNames;

  const adr = await Promise.all(
    names.map(async name => {
      const ens = `${name}.melonprotocol.eth`;

      return {
        ens,
        address: (await eth.ens.getAddress(ens)).toLowerCase()
      };
    })
  );

  res.setHeader("Cache-Control", "maxage=0, s-maxage=3600");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.send(adr);
}
