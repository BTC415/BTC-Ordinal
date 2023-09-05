// import { useLiveQuery } from "dexie-react-hooks";
// import { useCookies } from "react-cookie";
// import { db } from "../../db/db";
// import { useState } from "react";

// interface MyCustomWindow extends Window {
//   btc: {
//     request: any;
//     listen: any;
//   };
// }

// export const sign = async (
//   wallet: {
//     ordinalAddress: string;
//     cardinalAddress: string | null;
//     wallet: string;
//   },
//   onClose: () => void
// ) => {
//   const [cookies] = useCookies(["sessionId"]);
//   const [session, setSession] = useState<{
//     cardinalAddress: string;
//     id: string;
//     ordinalAddress: string;
//     wallet: string;
//   } | null>(null);

//   useLiveQuery(
//     async () => {
//       try {
//         const session = await db.session
//           .where("id")
//           .equals(cookies?.sessionId)
//           .toArray();

//         // Set session as state
//         setSession(
//           session?.[0] as {
//             cardinalAddress: string;
//             id: string;
//             ordinalAddress: string;
//             wallet: string;
//           }
//         );
//       } catch (error) {
//         setSession(null);
//       }
//     },
//     [session, cookies?.sessionId] // Include refresh in dependencies
//   );
//   // hiro signature
//   if (session?.wallet === "hiro") {
//     const customWindow: MyCustomWindow = window as unknown as MyCustomWindow;

//     const response = await customWindow?.btc?.request("signMessage", {
//       message: `Owned and Signed by ${wallet?.ordinalAddress}`,
//       paymentType: "p2tr",
//     });

//     if (response) {
//       onClose();
//     }
//     return "Not Signed";
//   }

//   // unisat signature
//   if (session?.wallet === "unisat") {
//     const signature = await (window as any).unisat.signMessage(
//       `Owned and Signed by ${wallet?.ordinalAddress}`
//     );

//     if (signature) {
//       onClose();
//     }
//     return "Not Signed";
//   }

//   if (session?.wallet === "xverse") {
//     const signature = await (window as any).unisat.signMessage(
//       `Owned and Signed by ${wallet?.ordinalAddress}`
//     );

//     if (signature) {
//       onClose();
//     }
//     return "Not Signed";
//   }

//   return;
// };
