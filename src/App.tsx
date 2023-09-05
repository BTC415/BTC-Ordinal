import { Button, Flex } from '@radix-ui/themes';
import React from 'react';
import WalletManager, { GetSession } from './components/WalletManager';
import { send } from "./components/send";

const App = () => {

  const useSession = GetSession()

  console.log("Session", useSession)

  return (
    <Flex direction="column" justify="between" align="center" height="100%" gap="5">
      <WalletManager />
      <Button onClick={() => send(15000, "bc1p2sd86hd9ufxxpnsys3ylgltfw7j7n0xk0kusy42fl9q0rkejwlzsjec96d", useSession)}>Send BTC</Button>
    </Flex>
  )
}

export default App;