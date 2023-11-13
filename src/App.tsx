import React from 'react';
import WalletManager, { GetSession } from './components/WalletManager';
import "./index.css"
const App = () => {

  // Get wallet info and user session
  const useSession = GetSession()

  console.log("Session", useSession)

  return (
    <>
      <WalletManager />
    </>
  )
}

export default App;