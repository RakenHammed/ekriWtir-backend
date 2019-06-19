import { Router } from "express";
import * as rentingDemandsController from "../controllers/rentingDemandsController";

export const rentingDemandsRoutes = Router();

/*
 * GET
 */
rentingDemandsRoutes.get("/", rentingDemandsController.list);

/*
 * GET
 */
rentingDemandsRoutes.get("/:id", rentingDemandsController.show);

/*
 * POST
 */
rentingDemandsRoutes.post("/", rentingDemandsController.create);

/*
 * POST
 */
rentingDemandsRoutes.post("/accept", rentingDemandsController.accept);

/*
 * PUT
 */
rentingDemandsRoutes.put("/:id", rentingDemandsController.update);

/*
 * DELETE
 */
rentingDemandsRoutes.delete("/:id", rentingDemandsController.remove);
