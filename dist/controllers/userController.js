"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * userController.list()
 */
exports.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.status(200).json();
    }
    catch (err) {
        res.status(500).json({
            error: err,
            message: "Error when getting users.",
        });
    }
});
/**
 * userController.show()
 */
exports.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        res.status(200).json(id);
    }
    catch (err) {
        res.status(500).json({
            error: err,
            message: "Error when getting user.",
        });
    }
});
/**
 * userController.create()
 */
exports.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        res.status(201).json();
        res.sendStatus(201);
    }
    catch (err) {
        res.status(500).json({
            error: err,
            message: "Error when creating user.",
        });
    }
});
/**
 * userController.update()
 */
exports.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
});
/**
 * userController.remove()
 */
exports.remove = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({
            error,
            message: "Error when deleting the user.",
        });
    }
});
//# sourceMappingURL=userController.js.map