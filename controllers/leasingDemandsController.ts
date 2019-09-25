import { Request, Response } from "express";
import * as carToken from "../build/contracts/CarToken.json";
import { Car } from "../models/Car";
import { LeasingDemand } from "../models/LeasingDemand";
import * as web3Provider from "../services/blockChainConnection";
import { adminPublicKey, carTokenContractAddress } from "../adminAndContractAddress.js";

/**
 * userController.list()
 */
export const list = async (req: Request, res: Response) => {
  try {
    const leasingDemands = await LeasingDemand.scope("full").findAll();
    res.status(201).json(leasingDemands);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting leasing demands.",
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
    const car = new Car({
      firstCirculationDate: req.body.car.firstCirculationDate,
      manufacturer: req.body.car.manufacturer,
      model: req.body.car.model,
      fuelType: req.body.car.fuelType,
      pricePerDay: req.body.car.pricePerDay,
      fromDate: req.body.car.fromDate,
      toDate: req.body.car.toDate,
      userId: req.body.user.id,
    });
    const dbCar = await car.save();
    const leasingDemand = new LeasingDemand({
      airport: req.body.airport,
      userId: req.body.user.id,
      carId: dbCar.id,
    });
    const dbLeasingDemand = await leasingDemand.save();
    res.status(201).json(dbLeasingDemand);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when creating the leasing demand.",
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

export const accept = async (req: Request, res: Response) => {
  const leasingDemandId = req.body.id;
  try {
    const leasingDemand = await LeasingDemand.scope("full").findOne({ where: { id: leasingDemandId } });
    const web3 = web3Provider.web3;
    const carId: number = leasingDemand.carId;
    const car: Car = leasingDemand.car;
    const carTokenContract = await new web3.eth.Contract(carToken.abi, carTokenContractAddress);
    await carTokenContract.methods.createCar(
      carId,
      adminPublicKey,
      car.pricePerDay,
    ).send({
      from: adminPublicKey,
      gas: 2000000,
    });
    await LeasingDemand.destroy({ where: { id: leasingDemandId } });
    res.status(204).json();
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting the leasing demand.",
    });
  }
};
