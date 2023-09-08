import '@btckit/types';
import { Avatar, Button, Dialog, Flex, IconButton, Text, TextField } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import React, { useState } from 'react';
import { useCookies } from "react-cookie";
import { BiCopy, BiSolidCircle } from 'react-icons/bi';
import { getAddress } from 'sats-connect';
import { v4 as uuidv4 } from "uuid";
import { db } from "./db/db";
import { Theme } from '@radix-ui/themes';
import { CookiesProvider } from 'react-cookie';

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
    mode?: "light" | "dark" | undefined,
    color: "ruby" | "tomato" | "red" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "brown" | "orange" | "sky" | "mint" | "lime" | "yellow" | "amber" | "gold" | "bronze" | "gray" | undefined
}

const WalletManager: React.FC<WalletManagerProps> = ({ mode, color }) => {
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

        // Connecting to Hiro wallet
        if (wallet === "hiro") {
            const result: any = await window.btc?.request("getAddresses", {
                types: ["p2tr", "p2wpkh"],
            });

            const walletInfo = {
                ordinalAddress: result?.result?.addresses[1].address,
                cardinalAddress: result?.result?.addresses[0].address,
                wallet: "hiro",
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
                console.log("Hiro Error", error)
                throw new Error(error);
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
        setOpen(false)
        setSession(null)
    };

    return (
        <CookiesProvider>
            <Theme appearance={mode as any || "dark"}>
                <Dialog.Root open={open}>
                    <Dialog.Trigger onClick={() => setOpen(true)}>
                        {session?.ordinalAddress ?
                            <Button variant="surface" color={color} highContrast>
                                <Avatar
                                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                                    fallback="S"
                                    size="1"
                                    radius="full"

                                />
                                <Text>{session?.ordinalAddress?.substr(0, 15)}...</Text>
                            </Button>
                            :
                            <Button variant="outline" color={color}>
                                Connect Wallet
                            </Button>
                        }
                    </Dialog.Trigger>

                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title>OrdConnect ⚡️</Dialog.Title>

                        {!session ? <>
                            <Dialog.Description size="2" mb="4">
                                Connect with your favourite wallet provider.
                            </Dialog.Description>
                            <Flex direction="column" gap="3">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">Most Popular</Text>
                                </label>
                                <Button onClick={() => walletConnect("hiro", null)} variant="outline" color={color}>
                                    <img style={{
                                        width: '1.5rem',
                                        borderRadius: "100%"
                                    }}
                                        src="https://cdn.discordapp.com/attachments/491727714102018088/1148748035141156874/hiro.png" />
                                    <Text>Leather (Hiro) Connect</Text>
                                </Button>
                                <Button onClick={async () => {
                                    const result = await unisat.requestAccounts();
                                    walletConnect("unisat", result)
                                }} variant="outline" color={color}>
                                    <img style={{
                                        width: '1rem',
                                        borderRadius: "100%"
                                    }}
                                        src="https://cdn.discordapp.com/attachments/491727714102018088/1148750793642623017/fA12aBLU_400x400.jpg" />
                                    <Text>Unisat Connect</Text>
                                </Button>
                                <Button onClick={async () => {
                                    walletConnect("xverse", null)
                                }} variant="outline" color={color}>
                                    <img style={{
                                        width: '1rem',
                                        borderRadius: "100%"
                                    }}
                                        src="https://cdn.discordapp.com/attachments/491727714102018088/1148748171732860989/xverse.png" />
                                    <Text>Xverse Connect</Text>
                                </Button>
                            </Flex>
                        </> :
                            <Flex direction="column" gap="3">
                                {session?.wallet === "unisat" &&
                                    <Flex width="100%" gap="2" align="center">
                                        <img style={{
                                            width: '1rem',
                                            borderRadius: "100%"
                                        }}
                                            src="https://cdn.discordapp.com/attachments/491727714102018088/1148750793642623017/fA12aBLU_400x400.jpg" />
                                        <Text color={color}>Unisat Wallet Connected</Text>
                                        <motion.div
                                            animate={{ opacity: [1, 0, 1] }}  // Animating the opacity from 1 to 0 and then back to 1
                                            transition={{ duration: 2, repeat: Infinity }}  // Duration of animation and repeat it indefinitely
                                        >
                                            <BiSolidCircle color={color} />
                                        </motion.div>
                                    </Flex>}
                                {session?.wallet === "hiro" &&
                                    <Flex width="100%" gap="2" align="center">
                                        <img style={{
                                            width: '2rem',
                                            borderRadius: "100%"
                                        }}
                                            src="https://cdn.discordapp.com/attachments/491727714102018088/1148748035141156874/hiro.png" />
                                        <Text color="gray">Hiro Wallet Connected</Text>
                                        <motion.div
                                            animate={{ opacity: [1, 0, 1] }}  // Animating the opacity from 1 to 0 and then back to 1
                                            transition={{ duration: 2, repeat: Infinity }}  // Duration of animation and repeat it indefinitely
                                        >
                                            <BiSolidCircle color="green" />
                                        </motion.div>
                                    </Flex>
                                }
                                {session?.wallet === "xverse" &&
                                    <Flex width="100%" gap="2" align="center">
                                        <img style={{
                                            width: '1rem',
                                            borderRadius: "100%"
                                        }}
                                            src="https://cdn.discordapp.com/attachments/491727714102018088/1148748171732860989/xverse.png" />
                                        <Text color="gray">Xverse Wallet Connected</Text>
                                        <motion.div
                                            animate={{ opacity: [1, 0, 1] }}  // Animating the opacity from 1 to 0 and then back to 1
                                            transition={{ duration: 2, repeat: Infinity }}  // Duration of animation and repeat it indefinitely
                                        >
                                            <BiSolidCircle color="green" />
                                        </motion.div>
                                    </Flex>
                                }
                                <Flex width="100%" direction="column" align="start" gap="1" justify="center">
                                    {session?.wallet !== "unisat" ?
                                        <>
                                            <TextField.Root >
                                                <TextField.Input disabled placeholder={session?.cardinalAddress} size="2" radius='full' width="100%" />
                                                <TextField.Slot>
                                                    <IconButton size="1" variant="ghost" onClick={() => navigator.clipboard.writeText(session?.cardinalAddress)} radius='full'>
                                                        <BiCopy />
                                                    </IconButton>
                                                </TextField.Slot>
                                            </TextField.Root>
                                            <TextField.Root>
                                                <TextField.Input disabled placeholder={session?.ordinalAddress} size="2" radius='full' width="100%" />
                                                <TextField.Slot>
                                                    <IconButton size="1" variant="ghost" onClick={() => navigator.clipboard.writeText(session?.ordinalAddress)} radius='full'>
                                                        <BiCopy />
                                                    </IconButton>
                                                </TextField.Slot>
                                            </TextField.Root>
                                        </>
                                        : <TextField.Root>
                                            <TextField.Input disabled placeholder={session?.ordinalAddress} size="2" radius='full' width="100%" />
                                            <TextField.Slot>
                                                <IconButton size="1" variant="ghost" onClick={() => navigator.clipboard.writeText(session?.ordinalAddress)} radius='full'>
                                                    <BiCopy />
                                                </IconButton>
                                            </TextField.Slot>
                                        </TextField.Root>}

                                </Flex>
                                <Button variant="outline" color={color} onClick={() => {
                                    signout()
                                }}><Text>Sign Out</Text></Button>
                            </Flex>}

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            </Theme>
        </CookiesProvider>
    );
}

export default WalletManager;