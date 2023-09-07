import { Flex, Button } from '@radix-ui/themes';
import React from 'react';
import WalletManager, { GetSession } from './components/WalletManager';
import { signature } from './components/signature';

const App = () => {

  // Get wallet info and user session
  const useSession = GetSession()

  return (
    <Flex direction="column" justify="between" align="center" height="100%" gap="5">
      <WalletManager />
      <Button onClick={() => signature("Testing Signature", useSession)}>Sign</Button>
    </Flex>
  )
}

export default App;