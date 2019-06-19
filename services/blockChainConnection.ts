import Web3 from "web3";

export const testnet = "http://127.0.0.1:7545";

export const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
