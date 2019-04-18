import { Router } from "express";
import * as userController from "../controllers/userController";

export const userRoutes = Router();

/*
 * GET
 */
userRoutes.get("/", userController.list);

/*
 * GET
 */
userRoutes.get("/:id", userController.show);

/*
 * POST
 */
userRoutes.post("/", userController.create);

/*
 * PUT
 */
userRoutes.put("/:id", userController.update);

/*
 * DELETE
 */
userRoutes.delete("/:id", userController.remove);
