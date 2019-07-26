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

  // TODO: check base and quote against predefined list

  if (!base) {
    res.send("Invalid request: base not set.");
    return;
  }

  const assets = [
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
    "ZRX"
  ];

  let path = `/v1/exchangerate/${base}`;
  if (quote) {
    path = path + `/${quote}`;
  } else {
    path = path + "?filter_asset_id=" + assets.join(";");
  }

  const response = await coinApi.get(path);

  if (!!response.data.error) {
    throw new Error(response.data.error);
  }

  res.setHeader("Cache-Control", "maxage=0, s-maxage=600");
  res.setHeader("Content-Type", "application/json");
  res.send(response.data);
}
