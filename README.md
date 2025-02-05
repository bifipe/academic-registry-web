# Academic Registry Web

## Overview
This project was built with React + Vite as an interface to interact with a smart contract as a blockchain solution to store and retrieve student information from allowed accounts.

## Prerequisites
- NodeJS v20.18.2
- MetaMask extension installed in your browser.
- Use the project [academic-record-blockchain](https://github.com/Reissel/academic-record-blockchain) to deploy the smart contract to the blockchain.

## Deploying the smart contract
Before running the frontend, you need to deploy the smart contract and obtain its address.
1. Clone and set up the [academic-record-blockchain](https://github.com/Reissel/academic-record-blockchain) project following its instructions.
2. After deploying the contract using `npx hardhat run scripts/deploy.js --network ganache`, copy the contract address displayed in the terminal.

## How to run locally
1. Configure the smart contract address:
   - Open the frontend project directory and edit the `src/lib/ethers.js` file.
   - Replace the value of `CONTRACT_ADDRESS` with the copied address.
2. Open a terminal at the root folder of the project and run the following command to install the dependencies:
   ```sh
   npm install
   ```
3. Run the following command to start the application:
   ```sh
   npm run dev
   ```
4. Access the application locally using the address shown in the terminal.

