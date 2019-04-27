import { Request, Response } from "express";
import Web3 from 'web3';

export const create = async (req: Request, res: Response) => {
    try {
        const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545', null, {});
        const account = await web3.eth.accounts.create();1
        const accountAddressAndPrivateKey = {
            "address": account.address,
            "privateKey": account.privateKey
        }
        res.status(201).json(accountAddressAndPrivateKey);
    } catch (err) {
      res.status(500).json({
        error: err,
        message: "Error when creating user.",
      });
    }
  };