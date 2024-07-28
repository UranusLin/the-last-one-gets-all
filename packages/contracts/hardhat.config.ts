import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "@typechain/hardhat";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  typechain: {
    outDir: "../frontend/src/types",
    target: "ethers-v6",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
  },
};

export default config;