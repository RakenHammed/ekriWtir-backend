import { Request, Response } from "express";
import * as fs from "fs";
import { Car } from "../models/Car";
import { LeasingDemand } from "../models/LeasingDemand";
import { RentingDemand } from "../models/RentingDemand";
import { User } from "../models/User";
import * as authenticationServices from "../services/authenticationServices";
import * as web3Provider from "../services/blockChainConnection";

/**
 * userController.list()
 */
export const list = async (req: Request, res: Response) => {
  try {
    const rentingDemands = await RentingDemand.scope().findAll();
    res.status(201).json(rentingDemands);
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
    const car = req.body.car;
    const rentingDemand = new RentingDemand({
      userId: car.renter.userId,
      carId: car.id,
      driverLicenseId: car.renter.driverLicenseId,
      driverLicenseDateOfIssue: car.renter.driverLicenseDateOfIssue,
    });
    const dbRentingDemand = await rentingDemand.save();
    const dbCar = await Car.scope().findOne({ where: { id: dbRentingDemand.carId } });
    const privateKey = req.body.privateKey;
    const web3 = web3Provider.web3;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const numberOfDays: number = numberOfDaysRented(dbCar.fromDate, dbCar.toDate);
    const totalAmount = numberOfDays * dbCar.pricePerDay;
    const dbUser = await User.scope().findOne({ where: { id: dbRentingDemand.userId } });
    const nonce: number = await web3.eth.getTransactionCount(dbUser.accountAddress);
    const signedTransactionData = await account.signTransaction({
      to: "0x622BDb2A8Fe6B716b0adCc74E11cc168f456f203",
      value: dinarToWei(totalAmount),
      gas: 2000000,
      gasPrice: "20000000000",
      nonce,
      chainId: 5777
    }, privateKey);
    await web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction).then(() => res.status(204).json());
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
      const rentingDemand = await RentingDemand.scope().findOne({ where: { id } });
      const car = await Car.scope().findOne({ where: { id: rentingDemand.id } });
      const numberOfDays: number = numberOfDaysRented(car.fromDate, car.toDate);
      const totalAmount = numberOfDays * car.pricePerDay;
      const web3 = web3Provider.web3;
      const user = await User.scope().findOne({ where: { id: rentingDemand.userId } });
      const privateKey = "8e125bb2d0f3758e2a5dd4474d9d3d246a6f59d4d435b19b744641f692066937";
      const nonce: number = await web3.eth.getTransactionCount("0x622BDb2A8Fe6B716b0adCc74E11cc168f456f203");
      const signedTransactionData = await web3.eth.accounts.signTransaction({
        to: user.accountAddress,
        value: dinarToWei(totalAmount),
        gas: 2000000,
        gasPrice: "20000000000",
        nonce,
        chainId: 5777
      }, privateKey);
      await web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction);
      await RentingDemand.destroy({ where: { id } });
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error when deleting the leasing demand.",
    });
  }
};

/**
 * userController.remove()
 */
export const accept = async (req: Request, res: Response) => {
  const id = req.body.id;
  try {
    const web3 = web3Provider.web3;
    const rentingDemand = await RentingDemand.scope().findOne({ where: { id } });
    const car = await Car.scope().findOne({ where: { id: rentingDemand.carId } });
    const user = await User.scope().findOne({ where: { id: rentingDemand.userId } });
    const carId = car.id;
    const numberOfDays: number = numberOfDaysRented(car.fromDate, car.toDate);
    fs.readFile("./build/contracts/CarToken.json", "utf8", async (error, data) => {
      const carToken = JSON.parse(data);
      try {
        const carTokenContract = await new web3.eth.Contract(carToken.abi, "0x9ad3dF2B2f535a8b94175d3Cc844a6A520Ae8B62");
        await carTokenContract.methods.transferCarToTheRenterAndSetTotalAmount(user.accountAddress, carId, numberOfDays).send({
          from: "0x622BDb2A8Fe6B716b0adCc74E11cc168f456f203",
          gas: 2000000,
        });
        await RentingDemand.destroy({ where: { id: rentingDemand.id } });
        res.status(204).json();
      } catch (error) {
        throw error;
      }
    });
    await RentingDemand.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error when deleting the leasing demand.",
    });
  }
};
// async function newFunction(req: Request) {
//   const privateKey = JSON.parse(req.query.account).privateKey;
//   const web3 = web3Provider.web3;
//   const account = web3.eth.accounts.privateKeyToAccount(privateKey);
//   const balanceWei = await web3.eth.getBalance(account.address);
//   const balanceEther = web3.utils.fromWei(balanceWei, "ether");
//   const signedTransactionData = await web3.eth.accounts.signTransaction({
//     to: "0xA795083A27F7CC62000A58513554f2c2bdF47C8e",
//     value: dinarToWei(),
//     gas: 2000000,
//     gasPrice: "20000000000",
//     nonce: 0,
//     chainId: 5777
//   }, privateKey);
//   const transaction = await web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction);
//   return transaction;
// }

function dinarToWei(priceInDinar: number): number {
  return priceInDinar * 0.0013 * 1000000000000000000;
}

function numberOfDaysRented(start: Date, end: Date): number {
  const diff = end.valueOf() - start.valueOf();
  const days = Math.ceil(diff / (1000 * 3600 * 24));
  return days;
}
