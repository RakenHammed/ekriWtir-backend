"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controllers/userController"));
exports.userRoutes = express_1.Router();
/*
 * GET
 */
exports.userRoutes.get("/", userController.list);
/*
 * GET
 */
exports.userRoutes.get("/:id", userController.show);
/*
 * POST
 */
exports.userRoutes.post("/", userController.create);
/*
 * PUT
 */
exports.userRoutes.put("/:id", userController.update);
/*
 * DELETE
 */
exports.userRoutes.delete("/:id", userController.remove);
//# sourceMappingURL=userRoutes.js.map