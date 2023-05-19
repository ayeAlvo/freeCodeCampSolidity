// const ethers = require('ethers');
// const fs = require('fs-extra');
// require('dotenv').config();

import { ethers } from 'ethers';
import * as fs from 'fs-extra';
import 'dotenv/config';

let main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_URL_SEPOLIA!
    );
    const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY_SEPOLIA!,
        provider
    );
    const abi = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.abi',
        'utf8'
    );
    const binary = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.bin',
        'utf8'
    );

    //Deploy
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log('Deploying, please wait...');
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);
    console.log(`Contract deployed to ${contract.address}`);

    //Get Number
    let currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
    console.log('Updating favorite number...');
    let transactionResponse = await contract.store('7');
    let transactionReceipt = await transactionResponse.wait(1);
    currentFavoriteNumber = await contract.retrieve();
    console.log(`New Favorite Number: ${currentFavoriteNumber}`);

    // const encryptedJson = fs.readFileSync('./.encryptedKey.json', 'utf8');
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD
    // );
    // wallet = wallet.connect(provider);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
