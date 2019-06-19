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
    authenticationServices.extractTokenAndVerify(req.headers.authorization);
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
    const car = new Car({
      firstCirculationDate: req.body.car.firstCirculationDate,
      manufacturer: req.body.car.manufacturer,
      model: req.body.car.model,
      fuelType: req.body.car.fuelType,
      pricePerDay: req.body.car.pricePerDay,
      fromDate: req.body.car.fromDate,
      toDate: req.body.car.toDate,
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

export const accept = async (req: Request, res: Response) => {
  const leasingDemandId = req.params.id;
  try {
    const leasingDemand = await LeasingDemand.scope("full").findOne({ where: { id: leasingDemandId } });
    const web3 = web3Provider.web3;
    const carId: number = leasingDemand.carId;
    const car: Car = leasingDemand.car;
    fs.readFile("./build/contracts/CarToken.json", "utf8", async (error, data) => {
      const carToken = JSON.parse(data);
      try {
        const carTokenContract = await new web3.eth.Contract(carToken.abi, "0x9ad3dF2B2f535a8b94175d3Cc844a6A520Ae8B62");
        await carTokenContract.methods.createCar(carId, "0x622BDb2A8Fe6B716b0adCc74E11cc168f456f203", car.pricePerDay).send({
          from: "0x622BDb2A8Fe6B716b0adCc74E11cc168f456f203",
          gas: 2000000,
        });
        await LeasingDemand.destroy({ where: { id: leasingDemandId } });
        res.status(204).json();
      } catch (error) {
        throw error;
      }
      //   try {
      //     const cars = await carTokenContract.methods.getAllCars().call();
      //     console.log(cars);
      //   } catch (error) {
      //     throw new Error(error);
      //   }
    });
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting the leasing demand.",
    });
  }
};
