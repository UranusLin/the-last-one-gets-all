import React from 'react';

interface ClaimPrizeProps {
    onClaim: () => void;
    isGameRunning: boolean;
    isWinner: boolean;
}

export const ClaimPrize: React.FC<ClaimPrizeProps> = ({ onClaim, isGameRunning, isWinner }) => {
    if (isGameRunning || !isWinner) return null;

    return (
        <button
            onClick={onClaim}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
            Claim Prize
        </button>
    );
};