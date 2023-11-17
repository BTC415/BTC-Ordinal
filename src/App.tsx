import React from 'react';
import WalletManager, { GetSession } from './components/WalletManager';
import "./index.css";
const App = () => {

  // Get wallet info and user session
  const session = GetSession()

  console.log("Session", session)

  return (
    <>
      <WalletManager />
    </>
  )
}

export default App;