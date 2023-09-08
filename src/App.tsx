import { Flex } from '@radix-ui/themes';
import React from 'react';
import WalletManager, { GetSession } from './components/WalletManager';

const App = () => {

  // Get wallet info and user session
  const useSession = GetSession()
  console.log("Session", useSession)

  return (
    <Flex direction="column" justify="between" align="center" height="100%" gap="5">
      <WalletManager color="bronze" mode='light' />
    </Flex>
  )
}

export default App;