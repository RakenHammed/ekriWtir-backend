import { Request, Response } from "express";
import * as authenticationServices from "../services/authenticationServices";
import { LeasingDemand } from "../models/LeasingDemand";
import { Car } from "../models/Car";

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
    const leasingDemand = await LeasingDemand.scope("full").findOne({ where: { id: id } });
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
    res.status(201).json(dbCar);
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
      await LeasingDemand.destroy({ where: { id: id } });
      await Car.destroy({ where: { renteeId: id } });
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error when deleting the leasing demand.",
    });
  }
};

