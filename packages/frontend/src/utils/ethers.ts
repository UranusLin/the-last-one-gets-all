import { ethers } from 'ethers';
import GameContractInfo from '../contracts/GameContract.json';

declare global {
    interface Window {
        ethereum?: any;
    }
}

let provider: ethers.BrowserProvider | null = null;

export const initProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
    } else {
        console.error('Please install MetaMask!');
    }
};

export const getProvider = (): ethers.BrowserProvider | null => {
    if (!provider) {
        initProvider();
    }
    return provider;
};

export const getSigner = async () => {
    const currentProvider = getProvider();
    if (!currentProvider) {
        throw new Error('Provider not initialized');
    }
    return await currentProvider.getSigner();
};

export const createContract = async (address: string, abi: any) => {
    const signer = await getSigner();
    return new ethers.Contract(address, abi, signer);
};

export const gameContractAddress = GameContractInfo.address;
export const gameContractABI = GameContractInfo.abi;

export const getGameContract = async () => {
    return await createContract(gameContractAddress, gameContractABI);
};

initProvider();