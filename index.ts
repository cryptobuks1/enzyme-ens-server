import { NowRequest, NowResponse } from "@now/node";
import Axios from "axios";

export default async function(req: NowRequest, res: NowResponse) {
  const { name = "World" } = req.query;

  const coinApi = Axios.create({
    baseURL: "https://swapi.co/api"
  });

  const response = await coinApi.get(`/people/1`);

  if (!!response.data.error) {
    throw new Error(response.data.error);
  }

  const data = response.data;

  res.setHeader("Cache-Control", "maxage=0, s-maxage=600");
  res.send(`Hello ${name}! Rate: ${data}`);
}
