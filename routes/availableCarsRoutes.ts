import { Router } from "express";
import * as availableCarsController from "../controllers/availableCarsController";

export const availableCarsRoutes = Router();

/*
 * GET
 */
availableCarsRoutes.get("/", availableCarsController.list);

/*
 * GET
 */
availableCarsRoutes.get("/:id", availableCarsController.show);

/*
 * POST
 */
availableCarsRoutes.post("/", availableCarsController.create);

/*
 * PUT
 */
availableCarsRoutes.put("/:id", availableCarsController.update);

/*
 * DELETE
 */
availableCarsRoutes.delete("/:id", availableCarsController.remove);
