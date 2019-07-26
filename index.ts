import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";

const coinApi = axios.create({
  baseURL: "https://rest.coinapi.io",
  headers: {
    "X-CoinAPI-Key": "73034021-0EBC-493D-8A00-E0F138111F41"
    // "X-CoinAPI-Key": process.env.COINAPI_KEY
  }
});

export default async function(req: NowRequest, res: NowResponse) {
  const { name = "World" } = req.query;

  const response = await coinApi.get(`/v1/exchangerate/MLN/ETH`);

  if (!!response.data.error) {
    throw new Error(response.data.error);
  }

  const rate = response.data && response.data.rate;

  res.setHeader("Cache-Control", "maxage=0, s-maxage=600");
  res.send(`Hello ${name}! Rate: ${rate}`);
}
