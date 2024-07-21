import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { GameStatus } from './components/GameStatus';
import { CallButton } from './components/CallButton';
import { ClaimPrize } from './components/ClaimPrize';
import { useGameContract } from './hooks/useGameContract';
import { getSigner } from './utils/ethers';

function App() {
  const { balance, lastCaller, isGameRunning, winner, prize, userAddress, callContract, claimPrize } = useGameContract();
  const [isWinner, setIsWinner] = useState(false);

  const checkWinner = useCallback(async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      setIsWinner(winner === address);
    } catch (error) {
      console.error('Error checking winner:', error);
      setIsWinner(false);
    }
  }, [winner]);

  useEffect(() => {
    if (winner) {
      (async () => {
        try {
          await checkWinner();
        } catch (error) {
          console.error('Error in useEffect:', error);
        }
      })();
    }
  }, [winner, checkWinner]);

  return (
      <Layout>
        <GameStatus
            balance={balance}
            lastCaller={lastCaller}
            isGameRunning={isGameRunning}
            winner={winner}
            prize={prize}
        />
        <CallButton onCall={callContract} isGameRunning={isGameRunning} />
        <ClaimPrize
            onClaim={claimPrize}
            isGameRunning={isGameRunning}
            isWinner={isWinner}
        />
      </Layout>
  );
}

export default App;