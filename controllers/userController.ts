import { Request, Response } from "express";
import Web3 from 'web3';
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authenticationServices from "../services/authenticationServices";

/**
 * userController.list()
 */
export const list = async (req: Request, res: Response) => {
  try {
    res.status(200).json();
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
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545', null, {});
  const account = web3.eth.accounts.create();
  const user = new User({
    accountPrivateKey: account.privateKey,
    accountAddress: account.address,
    email: req.body.email,
    password: hashPassword(req.body.password),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    birthDate: req.body.birthDate,
    nationalId: req.body.nationalId,
  });
  try {
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
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error when deleting the user.",
    });
  }
};

function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
