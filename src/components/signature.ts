import { BitcoinNetworkType, signTransaction } from "sats-connect";

// interface MyCustomWindow extends Window {
//   btc: {
//     request: any;
//     listen: any;
//   };
// }

export const signature = async (
  message: string,
  session: {
    cardinalAddress: string;
    id: string;
    ordinalAddress: string;
    wallet: string;
  } | null
) => {
  if (session?.wallet === "unisat") {
    const signature = await (window as any).unisat.signMessage(
      `${message} \n
        Owned and Signed by ${session?.ordinalAddress}
        `
    );

    if (signature) {
      return signature;
    }
    return "Not Signed";
  }

  if (session?.wallet === "xverse") {
    const signMessageOptions = {
      payload: {
        network: {
          type: BitcoinNetworkType.Mainnet,
        },
        address: "ordinalsAddress",
        message,
      },
      onFinish: (response: any) => {
        // signature
        alert(response);
      },
      onCancel: () => alert("Canceled"),
    };

    try {
      const response = await signTransaction(signMessageOptions as any);

      if (response as any) return response;
    } catch (error) {
      return {
        message: "Not signed",
        error,
      };
    }
  }

  // if (session?.wallet === "hiro") {
  //   const customWindow: MyCustomWindow = window as unknown as MyCustomWindow;

  //   const response = await customWindow?.btc?.request("signMessage", {
  //     message: `${message} \n
  //     Owned and Signed by ${session?.ordinalAddress}
  //     `,
  //     paymentType: "p2tr",
  //   });

  //   if (response) {
  //     return response;
  //   }
  //   return "Not Signed";
  // }

  return;
};
