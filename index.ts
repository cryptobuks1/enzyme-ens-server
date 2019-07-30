import { NowRequest, NowResponse } from "@now/node";
import Axios from "axios";

export default async function(req: NowRequest, res: NowResponse) {
  const { base, quote } = req.query;

  const coinApi = Axios.create({
    baseURL: "https://rest.coinapi.io",
    headers: {
      "X-CoinAPI-Key": "6F388926-927B-4582-AE90-B1C8CD3D5B60"
    }
  });

  const allowedAssets = [
    "BAT",
    "DAI",
    "DGX",
    "KNC",
    "MKR",
    "MLN",
    "REP",
    "USDC",
    "WBTC",
    "ETH",
    "ZRX",
    "USD"
  ];

  let path = "/v1/exchangerate/";
  if (
    base &&
    typeof base === "string" &&
    allowedAssets.includes(base as string)
  ) {
    path = path + base;
  } else {
    path = path + "ETH";
  }

  if (
    quote &&
    typeof quote === "string" &&
    allowedAssets.includes(quote as string)
  ) {
    path = path + `/${quote}`;
  } else {
    path = path + "?filter_asset_id=" + allowedAssets.join(";");
  }

  const response = await coinApi.get(path);

  if (!!response.data.error) {
    throw new Error(response.data.error);
  }

  res.setHeader("Cache-Control", "maxage=0, s-maxage=600");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.send(response.data);
}
