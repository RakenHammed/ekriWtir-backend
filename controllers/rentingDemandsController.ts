import { Request, Response } from "express";
import * as carToken from "../build/contracts/CarToken.json";
import { Car } from "../models/Car";
import { LeasingDemand } from "../models/LeasingDemand";
import { RentingDemand } from "../models/RentingDemand";
import * as web3Provider from "../services/blockChainConnection";
import { adminPublicKey, carTokenContractAddress } from "../adminAndContractAddress.js";

/**
 * userController.list()
 */
export const list = async (req: Request, res: Response) => {
  try {
    const rentingDemands = await RentingDemand.findAll();
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
    const dbCar = await Car.findOne({ where: { id: dbRentingDemand.carId } });
    const publicKey = req.body.publicKey;
    const web3 = web3Provider.web3;
    const numberOfDays: number = numberOfDaysRented(dbCar.fromDate, dbCar.toDate);
    const totalAmount = numberOfDays * dbCar.pricePerDay;
    const nonce: number = await web3.eth.getTransactionCount(publicKey);
    await web3.eth.sendTransaction({
      from: publicKey, // user
      to: adminPublicKey, // admin
      value: dinarToWei(totalAmount),
      gas: 2000000,
      gasPrice: "20000000000",
      nonce,
      chainId: 5777
    });
    res.status(204);
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
    const user: any = req.user;
    if (!user.isAdministrator) {
      return res.status(403).json({
        message: "Access forbidden.",
      });
    } else {
      const rentingDemand = await RentingDemand.scope("full").findOne({ where: { id } });
      const numberOfDays: number = numberOfDaysRented(rentingDemand.car.fromDate, rentingDemand.car.toDate);
      const totalAmount = numberOfDays * rentingDemand.car.pricePerDay;
      const web3 = web3Provider.web3;
      const nonce: number = await web3.eth.getTransactionCount(adminPublicKey);
      await web3.eth.sendTransaction({
        from: adminPublicKey, // user
        to: "0x9F8C7E7549Bf7aE0D4fc9a785d3316f51353CDf1", // admin
        value: dinarToWei(totalAmount),
        gas: 2000000,
        gasPrice: "20000000000",
        nonce,
        chainId: 5777
      });
      res.status(204);
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
    const rentingDemand = await RentingDemand.scope("full").findOne({ where: { id } });
    const carId = rentingDemand.car.id;
    const numberOfDays: number = numberOfDaysRented(rentingDemand.car.fromDate, rentingDemand.car.toDate);
    try {
      const carTokenContract = await new web3.eth.Contract(carToken.abi, carTokenContractAddress);
      await carTokenContract.methods.transferCarToTheRenterAndSetTotalAmount(rentingDemand.user.accountAddress, carId, numberOfDays).send({
        from: adminPublicKey,
        gas: 2000000,
      });
      await RentingDemand.destroy({ where: { id: rentingDemand.id } });
      res.status(204).json();
    } catch (error) {
      throw error;
    }
    await RentingDemand.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error when deleting the leasing demand.",
    });
  }
};

export const availableCars = async (req: Request, res: Response) => {
  try {
    const web3 = web3Provider.web3;
    const carTokenContract = await new web3.eth.Contract(carToken.abi, carTokenContractAddress);
    const cars = await carTokenContract.methods.getAllAvailableCars().call();
    const carsIds: number[] = cars.map((car) => car.id);
    const dbCars = await Car.scope("full").findAll({ where: { id: carsIds } });
    res.status(201).json(dbCars);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting renting demands.",
    });
  }
};

function dinarToWei(priceInDinar: number): number {
  return priceInDinar * 0.0013 * 1000000000000000000;
}

function numberOfDaysRented(start: Date, end: Date): number {
  const diff = end.valueOf() - start.valueOf();
  const days = Math.ceil(diff / (1000 * 3600 * 24));
  return days;
}
