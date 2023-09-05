import { BitcoinNetworkType, sendBtcTransaction } from "sats-connect";

let unisat: any;

if (typeof window !== "undefined") {
  // Your client-side code that uses window here
  console.log("Yo")
  unisat = (window as any).unisat;
}
export const send = async (
  amount: number,
  address: string,
  session: {
    cardinalAddress: string;
    id: string;
    ordinalAddress: string;
    wallet: string;
  } | null
) => {
  console.log("Hi")

  if (session?.wallet === "unisat") {
    unisat.sendBitcoin(address, amount);
  }

  if (session?.wallet === "hiro") {
    window.btc?.request("sendTransfer", {
      address,
      amount,
    });
  }

  if (session?.wallet === "xverse") {
    await sendBtcTransaction({
      payload: {
        network: {
          type: BitcoinNetworkType.Mainnet,
        },
        recipients: [
          {
            address: address,
            amountSats: BigInt(amount),
          },
        ],
        senderAddress: session?.cardinalAddress as string,
      },
      onFinish: (response) => {
        alert(response);
      },
      onCancel: () => alert("Canceled"),
    });
  }
};
