import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models/User";
import * as authenticationServices from "../services/authenticationServices";

/**
 * userController.list()
 */

export const list = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
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
    const user: any = req.user;
    if (!user.isAdministrator) {
      return res.status(403).json({
        message: "Access forbidden.",
      });
    } else {
      await User.destroy({ where: { id } });
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
    throw (err);
  }
}
