import { Flex } from '@radix-ui/themes';
import React from 'react';
import WalletManager, { GetSession } from './components/WalletManager';

const App = () => {

  const useSession = GetSession()

  console.log("Session", useSession)

  return (
    <Flex direction="column" justify="between" align="center" height="100%" gap="5">
      <WalletManager />
    </Flex>
  )
}

export default App;