import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../components/ui/dialog";
import '@btckit/types';
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import React, { useState } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";
import { BiSolidCircle } from 'react-icons/bi';
import { getAddress } from 'sats-connect';
import { v4 as uuidv4 } from "uuid";
import { db } from "./db/db";
import { Button } from "./ui/button";

// Get Session
export const GetSession = () => {
    const [cookies] = useCookies(["sessionId"]);
    const [session, setSession] = useState<{
        cardinalAddress: string;
        id: string;
        ordinalAddress: string;
        wallet: string;
    } | null>(null);

    useLiveQuery(
        async () => {
            try {
                const session = await db.session
                    .where("id")
                    .equals(cookies?.sessionId)
                    .toArray();

                // Set session as state
                setSession(
                    session?.[0] as {
                        cardinalAddress: string;
                        id: string;
                        ordinalAddress: string;
                        wallet: string;
                    }
                );

                return;
            } catch (error) {
                return error;
            }
        },
        [cookies?.sessionId] // Include refresh in dependencies
    );

    return session;
};

/*eslint no-undef: "error"*/
let unisat: any

if (typeof window !== 'undefined') {
    // Your client-side code that uses window here
    unisat = (window as any).unisat;
}
interface WalletManagerProps {

}

const WalletManager: React.FC<WalletManagerProps> = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["sessionId"]);
    const [open, setOpen] = React.useState(false);
    const [session, setSession] = useState<{
        cardinalAddress: string,
        id: string,
        ordinalAddress: string,
        wallet: string,
    } | null>(null)

    // Query IndexedDB
    useLiveQuery(
        async () => {
            try {
                const session = await db.session
                    .where('id')
                    .equals(cookies?.sessionId)
                    .toArray();

                // Set session as state
                setSession(session?.[0] as {
                    cardinalAddress: string,
                    id: string,
                    ordinalAddress: string,
                    wallet: string,
                })
            } catch (error) {
                setSession(null)
            }
        },
        [session, cookies?.sessionId] // Include refresh in dependencies
    );

    // Wallet Connect and setting session cookie + indexedDB
    const walletConnect = async (
        wallet: string,
        unisatResult: string[] | null,
    ) => {

        // Connecting to Unisat wallet
        if (wallet === "unisat") {
            const walletInfo = {
                ordinalAddress: unisatResult?.[0],
                cardinalAddress: null,
                wallet: "unisat",
            };

            try {
                // Create session id
                const sessionId = uuidv4();

                // Create session object
                const sessionObject = {
                    id: sessionId,
                    ordinalAddress: walletInfo?.ordinalAddress,
                    cardinalAddress: walletInfo?.cardinalAddress,
                    wallet: walletInfo?.wallet,
                };
                // Set cookie in browser
                setCookie("sessionId", sessionId, { path: "/" });
                // Set session info in indexedDB
                await db.session.add(sessionObject);

                setOpen(false)

                return walletInfo;
            } catch (error) {
                console.log("Unisat Error", error)
                return error
            }
        }


        // Connecting to Xverse wallet
        if (wallet === "xverse") {
            const getAddressOptions: any = {
                payload: {
                    purposes: ['ordinals', 'payment'],
                    message: 'Address for receiving Ordinals and payments',
                    network: {
                        type: 'Mainnet'
                    },
                },
                onFinish: async (response: any) => {
                    const walletInfo = {
                        ordinalAddress: response?.addresses?.[0]?.address,
                        cardinalAddress: response?.addresses?.[1]?.address,
                        wallet: "xverse",
                    };

                    try {
                        // Create session id
                        const sessionId = uuidv4();

                        // Create session object
                        const sessionObject = {
                            id: sessionId,
                            ordinalAddress: walletInfo?.ordinalAddress,
                            cardinalAddress: walletInfo?.cardinalAddress,
                            wallet: walletInfo?.wallet,
                        };
                        // Set cookie in browser
                        setCookie("sessionId", sessionId, { path: "/" });
                        // Set session info in indexedDB
                        await db.session.add(sessionObject);

                        setOpen(false)

                        return walletInfo;
                    } catch (error: any) {
                        console.log("Xverse Error", error)
                        throw new Error(error);
                    }
                },
                onCancel: () => console.log('Request canceled'),
            }

            await getAddress(getAddressOptions);
        }
        return
    }

    // Signout
    const signout = async () => {
        // Remove cookie from browser
        await removeCookie("sessionId", cookies?.sessionId)
        setSession(null)
    };

    return (
        <CookiesProvider>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger onClick={() => setOpen(true)}>
                    {session?.ordinalAddress ?
                        <Button variant="outline">
                            <p>Connected</p>
                        </Button>
                        :
                        <Button variant="outline">Connect Wallet</Button>
                    }
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>OrdConnect ⚡️</DialogTitle>
                        {!session ? <>
                            <DialogDescription>
                                Connect with your favourite wallet provider.
                            </DialogDescription>
                            <div className='flex flex-col gap-3 pt-4'>
                                <Button variant="outline" className="gap-2" onClick={async () => {
                                    const result = await unisat.requestAccounts();
                                    walletConnect("unisat", result)
                                }}>
                                    {/* <img src="/logo_unisat.svg" className="w-4" /> */}
                                    <p>Unisat Connect</p>
                                </Button>
                                <Button className="gap-2" onClick={async () => {
                                    walletConnect("xverse", null)
                                }} variant="outline">
                                    {/* <img src="/logo_dark.svg" className="w-4" /> */}
                                    <p>Xverse Connect</p>
                                </Button>
                            </div>

                        </>
                            :
                            <div>
                                <div className='flex flex-col gap-3'>
                                    {session?.wallet === "unisat" &&
                                        <div className='w-full gap-2 pt-3 flex items-center' >
                                            <motion.div
                                                animate={{ opacity: [1, 0, 1] }}  // Animating the opacity from 1 to 0 and then back to 1
                                                transition={{ duration: 2, repeat: Infinity }}  // Duration of animation and repeat it indefinitely
                                            >
                                                <BiSolidCircle color="green" />
                                            </motion.div>
                                            <p>Unisat Wallet Connected</p>
                                        </div>}
                                    {session?.wallet === "xverse" &&
                                        <div className='w-full gap-2 pt-3 flex items-center' >
                                            <motion.div
                                                animate={{ opacity: [1, 0, 1] }}  // Animating the opacity from 1 to 0 and then back to 1
                                                transition={{ duration: 2, repeat: Infinity }}  // Duration of animation and repeat it indefinitely
                                            >
                                                <BiSolidCircle color="green" />
                                            </motion.div>
                                            <p>Xverse Wallet Connected</p>
                                        </div>
                                    }
                                    <p className='w-full flex flex-col items-start justify-center gap-1'>
                                    </p>
                                </div>
                            </div>}

                        <div className='flex gap-3 pt-3 justify-end'>
                            <DialogFooter>
                                {session && <Button variant="outline" onClick={() => {
                                    signout()
                                }}><p>Sign Out</p></Button>}
                                <Button onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </CookiesProvider>
    );
}

export default WalletManager;