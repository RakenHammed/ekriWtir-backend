import { Request, Response } from "express";

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
    res.status(201).json();
    res.sendStatus(201);
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
