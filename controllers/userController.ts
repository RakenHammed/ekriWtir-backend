import { Request, Response } from "express";
import Web3 from 'web3';
import { User } from "../models/User";
import bcrypt from "bcrypt";
import * as authenticationServices from "../services/authenticationServices";
import sequelize = require("sequelize");
import { Op } from "sequelize";

/**
 * userController.list()
 */

function setUserFilters(req: Request) {
  const filtersObject = JSON.parse(req.query.filters || "{}");
  let whereId = {};
  let whereIsRenter = {};
  let whereIsRentee = {};
  let whereFirstName = {};
  let whereLastName = {};
  let whereEmail = {};
  let wherePhoneNumber = {};
  // use filters sent by user:
  if ("isRentee" in filtersObject) {
    whereIsRentee = sequelize.where(sequelize.col("isRentee"), `${filtersObject.isShopper}`);
  }
  if ("isRenter" in filtersObject) {
    whereIsRenter = sequelize.where(sequelize.col("isRenter"), `${filtersObject.isDriver}`);
  }
  if ("firstName" in filtersObject) {
    whereFirstName = sequelize.where(
      sequelize.fn("unaccent", sequelize.col("firstName")),
      { [Op.iLike]: sequelize.fn("unaccent", `%${filtersObject.firstName}%`) },
    );
  }
  if ("lastName" in filtersObject) {
    whereLastName = sequelize.where(
      sequelize.fn("unaccent", sequelize.col("lastName")),
      { [Op.iLike]: sequelize.fn("unaccent", `%${filtersObject.lastName}%`) },
    );
  }
  if ("email" in filtersObject) {
    whereEmail = sequelize.where(
      sequelize.col("email"),
      { [Op.iLike]: `%${filtersObject.email}%` },
    );
  }
  if ("phoneNumber" in filtersObject) {
    wherePhoneNumber = sequelize.where(
      sequelize.col("phoneNumber"),
      { [Op.iLike]: `%${filtersObject.phoneNumber}%` },
    );
  }
  return sequelize.and(
    whereId,
    whereIsRenter,
    whereIsRentee,
    whereFirstName,
    whereLastName,
    whereEmail,
    wherePhoneNumber,
  );
}

export const list = async (req: Request, res: Response) => {
  const dbFilters = setUserFilters(req);
  try {
    authenticationServices.extractTokenAndVerify(req.headers.authorization);
    const users = await User.findAll(
      { where: dbFilters }
    );
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting users.",
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
    res.status(200).json(id);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when getting user.",
    });
  }
};

/**
 * userController.create()
 */
export const create = async (req: Request, res: Response) => {
  try {
    const user = new User({
      accountAddress: req.body.accountAddress,
      email: req.body.email,
      password: hashPassword(req.body.password),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      birthDate: req.body.birthDate,
      nationalId: req.body.nationalId,
    });
    const dbUser = await user.save();
    res.status(201).json(dbUser);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Error when creating user.",
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
      await User.destroy({ where: { id: id } });
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error when deleting the user.",
    });
  }
};

function hashPassword(password: string): string {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  } catch (err) {
    throw (err)
  }
}
