import { ethers, upgrades } from "hardhat";
import fs from 'fs';
import path from 'path';

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const GameContract = await ethers.getContractFactory("GameContract");
    const gameContract = await upgrades.deployProxy(GameContract, [], {
        initializer: 'initialize',
        kind: 'uups'
    });

    await gameContract.waitForDeployment();

    const contractAddress = await gameContract.getAddress();

    console.log("GameContract proxy deployed to:", contractAddress);

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(contractAddress);
    console.log("GameContract implementation deployed to:", implementationAddress);

    updateFrontendFiles(contractAddress, implementationAddress);
}

function updateFrontendFiles(proxyAddress: string, implementationAddress: string) {
    const contractsDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'contracts');

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
    }

    const contractConfigFile = path.join(contractsDir, 'GameContract.json');

    let contractConfig = {
        address: '',
        implementationAddress: '',
        abi: []
    };
    if (fs.existsSync(contractConfigFile)) {
        const rawConfig = fs.readFileSync(contractConfigFile, 'utf8');
        contractConfig = JSON.parse(rawConfig);
    }

    contractConfig.address = proxyAddress;
    contractConfig.implementationAddress = implementationAddress;

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