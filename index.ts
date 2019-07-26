import { NowRequest, NowResponse } from "@now/node";

export default function(req: NowRequest, res: NowResponse) {
  const { name = "World" } = req.query;
  res.setHeader("Cache-Control", "s-maxage=600");
  res.send(`Hello ${name}!`);
}
