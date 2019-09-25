import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import jwt = require("jwt-simple");
import { User } from "../models/User";

export const indexRouter = Router();

indexRouter.use("/", async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!req.url.startsWith("/users/login")) {
    try {
      if (authorization && authorization.length > 10) {
        if (typeof authorization !== "string") {
          throw new Error("typeof authorization");
        }
        const token = authorization.substring(7);
        const decoded = jwt.decode(token, "shhhhh");
        const user: User = await User.scope("auth").findOne({ where: { id: decoded.id } });
        if (!user) {
          throw new Error("unauthorized");
        }
        req.user = user;
        return next();
      } else {
        throw new Error();
      }
    } catch (error) {
      res.status(401).json({
        message: "not logged in",
      });
    }
  }
  return next();
});

/* GET home page. */
indexRouter.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});
