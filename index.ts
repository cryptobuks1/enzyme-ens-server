import { NowRequest, NowResponse } from "@vercel/node";
import Web3 from "web3";

export default async function (req: NowRequest, res: NowResponse) {
  const web3 = new Web3(Web3.givenProvider || process.env.ETHNODE_MAINNET);

  const { d } = req.query;

  const standardNames = [
    "melontoken",
    "version",
    "registry",
    "fundfactory",
    "pricefeed",
    "engine",
    "engineadapter",
    "uniswapadapter",
    "kyberadapter",
    "oasisdexadapter",
    "zeroexv2adapter",
    "zeroexv3adapter",
    "managementfee",
    "performancefee",
  ];

  const names = d && typeof d === "string" ? d.split(",") : standardNames;

  const adr = await Promise.all(
    names.map(async (name) => {
      const ens = `${name}.melonprotocol.eth`;

      return {
        ens,
        address: (await web3.eth.ens.getAddress(ens)).toLowerCase(),
      };
    })
  );

  res.setHeader("Cache-Control", "maxage=0, s-maxage=3601");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.send(adr);
}
