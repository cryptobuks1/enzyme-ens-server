import { NowRequest, NowResponse } from "@now/node";
import Axios from "axios";

export default async function(req: NowRequest, res: NowResponse) {
  const { name = "World", base, quote } = req.query;

  const coinApi = Axios.create({
    baseURL: "https://rest.coinapi.io",
    headers: {
      "X-CoinAPI-Key": "6F388926-927B-4582-AE90-B1C8CD3D5B60"
    }
  });

  if (!base || !quote) {
    res.send(`base and/or quote not set`);
    return;
  }

  const response = await coinApi.get(`/v1/exchangerate/${base}/${quote}`);

  if (!!response.data.error) {
    throw new Error(response.data.error);
  }

  const data = JSON.stringify(response.data);

  res.setHeader("Cache-Control", "maxage=0, s-maxage=600");
  res.send(`Hello ${name}! Base: ${base}, quote: ${quote}. Data: ${data}`);
}
