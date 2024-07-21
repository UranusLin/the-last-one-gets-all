import { ethers } from "hardhat";
import fs from 'fs';
import path from 'path';

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const GameContract = await ethers.getContractFactory("GameContract");
    const gameContract = await GameContract.deploy({ value: ethers.parseEther("0.1") });

    await gameContract.waitForDeployment();

    const contractAddress = await gameContract.getAddress();

    console.log("GameContract deployed to:", contractAddress);

    updateFrontendFiles(contractAddress);
}

function updateFrontendFiles(contractAddress: string) {
    const contractsDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'contracts');

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
    }

    const contractConfigFile = path.join(contractsDir, 'GameContract.json');

    let contractConfig = { address: '', abi: [] };
    if (fs.existsSync(contractConfigFile)) {
        const rawConfig = fs.readFileSync(contractConfigFile, 'utf8');
        contractConfig = JSON.parse(rawConfig);
    }

    contractConfig.address = contractAddress;

    const artifact = require('../artifacts/contracts/GameContract.sol/GameContract.json');
    contractConfig.abi = artifact.abi;

    fs.writeFileSync(contractConfigFile, JSON.stringify(contractConfig, null, 2));

    console.log('Frontend contract file updated:', contractConfigFile);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });