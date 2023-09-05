import { Params } from "@btckit/types";

export const signPsbt = async (params: Params) => {
  const response = await (window as any).btc.request("signPsbt", params);

  return response
};
