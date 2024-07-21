# The Last One Gets All

This project implements a smart contract game where the last caller within a 24-hour period can claim the entire balance as a prize. It includes a Solidity smart contract and a React frontend for interaction.

## Project Structure

The project is organized as a monorepo with the following structure:
```
the-last-one-gets-all/
├── packages/
│   ├── contracts/     # Solidity smart contract
│   └── frontend/      # React frontend application
├── README.md
└── package.json
```
## Prerequisites

- Node.js (v14 or later)
- Yarn
- MetaMask browser extension

## Setup and Installation

1. Clone the repository:
    ```shell
    git clone https://github.com/UranusLin/the-last-one-gets-all.git
    cd the-last-one-gets-all
    ```

2. Install dependencies:
    ```shell
    yarn install
    ```
3. Compile the smart contract:
    ```shell
    yarn contracts
    ```
## Running the Application
```shell
yarn dev
```
Or
1. start node
    ```shell
    yarn start:node
    ```
2. deploy contract
    ```shell
    yarn deploy:local
    ```
3. start frontend
    ```shell
    yarn start:frontend
    ```

4. Open your browser and navigate to `http://localhost:3000`

## Testing

### Smart Contract Tests

Run the smart contract tests with:
```shell
yarn contracts test
```

### Frontend Tests

Run the frontend tests with:
```shell
yarn frontend test
```

## Interacting with the Application

1. Ensure MetaMask is connected to the Hardhat local network (usually http://localhost:8545).
2. Import one of the test accounts provided by Hardhat into MetaMask.
3. Use the web interface to call the contract or claim the prize when applicable.

## Potential Exploits

One potential exploit of this system could be:

- Time manipulation: A miner could potentially manipulate the block timestamp to force the game to end prematurely or extend it unfairly. This is a known issue with using block timestamps for time-sensitive operations in smart contracts.

## Technologies Used

- Solidity
- Hardhat
- React
- Tailwind CSS
- ethers.js
- TypeScript

