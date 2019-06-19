import { Request, Response } from "express";
import * as fs from "fs";
import { Car } from "../models/Car";
import { LeasingDemand } from "../models/LeasingDemand";
import * as authenticationServices from "../services/authenticationServices";
import * as web3Provider from "../services/blockChainConnection";

/**
 * userController.list()
 */
export const list = async (req: Request, res: Response) => {
  try {
    // const transaction = await newFunction(req);
    const web3 = web3Provider.web3;
    fs.readFile("./build/contracts/CarToken.json", "utf8", async (error, data) => {
      const carToken = JSON.parse(data);
      try {
        const carTokenContract = await new web3.eth.Contract(carToken.abi, "0x9ad3dF2B2f535a8b94175d3Cc844a6A520Ae8B62");
        const cars = await carTokenContract.methods.getAllAvailableCars().call();
        const carsIds: number[] = [];
        for (const car of cars) {
          carsIds.push(car.id);
        }
        const dbCars = await Car.scope().findAll({ where: { id: carsIds } });
        res.status(201).json(dbCars);
      } catch (error) {
        throw new Error(error);
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting renting demands.",
    });
  }
};

/**
 * userController.show()
 */
export const show = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    authenticationServices.extractTokenAndVerify(req.headers.authorization);
    const leasingDemand = await LeasingDemand.scope("full").findOne({ where: { id } });
    res.status(201).json(leasingDemand);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting the leasing demand.",
    });
  }
};

/**
 * userController.create()
 */
export const create = async (req: Request, res: Response) => {
  try {

    const privateKey =

      res.status(201).json();
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when creating the renting demand.",
    });
  }
};

/**
 * userController.update()
 */
export const update = async (req: Request, res: Response) => {
};

/**
 * userController.remove()
 */
export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user: any = authenticationServices.extractTokenAndVerify(req.headers.authorization);
    if (!user.isAdministrator) {
      return res.status(403).json({
        message: "Access forbidden.",
      });
    } else {
      await LeasingDemand.destroy({ where: { id } });
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error when deleting the leasing demand.",
    });
  }
};

async function newFunction(req: Request) {
  const privateKey = JSON.parse(req.query.account).privateKey;
  const web3 = web3Provider.web3;
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const balanceWei = await web3.eth.getBalance(account.address);
  const balanceEther = web3.utils.fromWei(balanceWei, "ether");
  const signedTransactionData = await web3.eth.accounts.signTransaction({
    to: "0xA795083A27F7CC62000A58513554f2c2bdF47C8e",
    value: "1000000000000000000",
    gas: 2000000,
    gasPrice: "20000000000",
    nonce: 0,
    chainId: 5777
  }, privateKey);
  const transaction = await web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction);
  return transaction;
}

