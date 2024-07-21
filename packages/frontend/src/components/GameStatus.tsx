import React from 'react';

interface GameStatusProps {
    balance: string;
    lastCaller: string;
    isGameRunning: boolean;
    winner: string;
    prize: string;
}

export const GameStatus: React.FC<GameStatusProps> = ({ balance, lastCaller, isGameRunning, winner, prize }) => {
    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Game Status</h2>
            <p>Current Balance: {balance} ETH</p>
            {isGameRunning ? (
                <p>Last Caller: {lastCaller}</p>
            ) : (
                <>
                    <p>Winner: {winner}</p>
                    <p>Prize: {prize} ETH</p>
                </>
            )}
        </div>
    );
};