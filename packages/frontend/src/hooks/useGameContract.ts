import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {getGameContract, getProvider} from '../utils/ethers';

export function useGameContract() {
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [balance, setBalance] = useState<string>('0');
    const [lastCaller, setLastCaller] = useState<string>('');
    const [isGameRunning, setIsGameRunning] = useState<boolean>(true);
    const [winner, setWinner] = useState<string>('');
    const [prize, setPrize] = useState<string>('0');
    const [userAddress, setUserAddress] = useState<string>('');

    useEffect(() => {
        async function initContract() {
            try {
                const provider = getProvider();
                if (provider) {
                    const network = await provider.getNetwork();
                    console.log("Connected to network:", network.name);

                    const gameContract = await getGameContract();
                    setContract(gameContract);

                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    setUserAddress(address);

                    const balance = await provider.getBalance(address);
                    console.log("Account balance:", ethers.formatEther(balance));
                }
            } catch (error) {
                console.error('Error initializing contract:', error);
            }
        }
        initContract();
    }, []);


    const updateGameStatus = useCallback(async () => {
        if (!contract) return;

        try {
            const [_lastCaller, _lastCallTime, _balance, _isGameRunning] = await contract.getGameStatus();
            setBalance(ethers.formatEther(_balance));
            setLastCaller(_lastCaller);
            setIsGameRunning(_isGameRunning);

            if (!_isGameRunning) {
                setWinner(_lastCaller);
                setPrize(ethers.formatEther(_balance));
            }
        } catch (error) {
            console.error('Error updating game status:', error);
        }
    }, [contract]);

    useEffect(() => {
        if (contract) {
            updateGameStatus();
            const interval = setInterval(updateGameStatus, 10000); // 每10秒更新一次
            return () => clearInterval(interval);
        }
    }, [contract, updateGameStatus]);

    const callContract = async () => {
        if (!contract) return;
        try {
            const tx = await contract.call({ value: ethers.parseEther('0.01') });
            await tx.wait();
            await updateGameStatus();
        } catch (error) {
            console.error('Error calling contract:', error);
        }
    };

    const claimPrize = async () => {
        if (!contract) return;
        try {
            const tx = await contract.claimPrize();
            await tx.wait();
            await updateGameStatus();
        } catch (error) {
            console.error('Error claiming prize:', error);
        }
    };

    return {
        balance,
        lastCaller,
        isGameRunning,
        winner,
        prize,
        userAddress,
        callContract,
        claimPrize
    };
}

