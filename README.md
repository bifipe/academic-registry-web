# Academic Registry Web

## Overview
This project was built with React + Vite as an interface to interact with a smart contract as a blockchain solution to store and retrieve student information from allowed accounts.

## Prerequisites
- NodeJS v20.18.2
- MetaMask extension installed in your browser.
- Use the project [academic-record-blockchain](https://github.com/Reissel/academic-record-blockchain) to deploy the contract to the blockchain.

## How to run locally
1. Run `npm install` to install the dependencies.
2. Set up the smart contract address:
   - After deploying the contract using `npx hardhat run scripts/deploy.js --network ganache`, copy the contract address displayed in the terminal.
   - In the frontend project directory, open the `src/lib/ethers.js` file.
   - Replace the value of `CONTRACT_ADDRESS` with the copied address.
3. Run `npm run dev` on a terminal at the root folder of the project to start.
