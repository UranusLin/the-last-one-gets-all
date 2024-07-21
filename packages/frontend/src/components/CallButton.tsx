import React from 'react';

interface CallButtonProps {
    onCall: () => void;
    isGameRunning: boolean;
}

export const CallButton: React.FC<CallButtonProps> = ({ onCall, isGameRunning }) => {
    if (!isGameRunning) return null;

    return (
        <button
            onClick={onCall}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Call Contract (0.01 ETH)
        </button>
    );
};