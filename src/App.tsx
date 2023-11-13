import React from 'react';
import WalletManager, { GetSession } from './components/WalletManager';

const App = () => {

  // Get wallet info and user session
  const useSession = GetSession()

  console.log("Session", useSession)
  /* 
  This is for myself just had an idea
  Add a custom session prop that’s Boolean to wallet manager component
  If true, then the session creating function will be exported and user can user their own storage to store session info
  Verses indexeddb

  use session server side
  */
  return (
    <WalletManager color="bronze" mode='light' />
  )
}

export default App;