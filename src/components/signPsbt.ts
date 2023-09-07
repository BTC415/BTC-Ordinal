import { Params } from "@btckit/types";

// sign and broadcast psbt using @btckit
export const signPsbt = async (params: Params) => {
  const response = await (window as any).btc.request("signPsbt", params);

  return response;
};
