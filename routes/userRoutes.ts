import { Router } from "express";
import * as userController from "../controllers/userController";
import * as authenticationServices from "../services/authenticationServices";

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
 * POST
 */
userRoutes.post("/login", authenticationServices.login);

/*
 * PUT
 */
userRoutes.put("/:id", userController.update);

/*
 * DELETE
 */
userRoutes.delete("/:id", userController.remove);
