import { Router } from "express";
import * as leasingDemandsController from "../controllers/leasingDemandsController";

export const leasingDemandsRoutes = Router();

/*
 * GET
 */
leasingDemandsRoutes.get("/", leasingDemandsController.list);

/*
 * GET
 */
leasingDemandsRoutes.get("/:id", leasingDemandsController.show);

/*
 * POST
 */
leasingDemandsRoutes.post("/", leasingDemandsController.create);

/*
 * POST
 */
leasingDemandsRoutes.post("/accept", leasingDemandsController.accept);

/*
 * PUT
 */
leasingDemandsRoutes.put("/:id", leasingDemandsController.update);

/*
 * DELETE
 */
leasingDemandsRoutes.delete("/:id", leasingDemandsController.remove);
