import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
    try {
        const dbUser: User = await checkEmail(req.body.email);
        checkPassword(req.body.password, dbUser.password);
        const user = dbUser.dataValues;
        delete user.birthDate;
        delete user.accountPrivateKey;
        delete user.password;
        const token = jwt.sign(user, 'shhhhh');
        res.status(201).json(token);
    } catch (error) {
        res.status(500).json({
            error: error,
            message: error,
        });
    }
};

function checkPassword(password: string, hash: string) {
    if (!bcrypt.compareSync(password, hash)) {
        throw ("wrong password");
    }
}

async function checkEmail(email: string): Promise<User> {
    const user = await User.scope("auth").findOne({
        where: { email: email },
    });
    if (!user) {
        throw ("email does not exist");
    } else {
        return user;
    }
}

export function extractTokenAndVerify(authorization?: string) {
    if (authorization && authorization.length > 10) {
        const token = (typeof authorization === "string") ? authorization.substring(7) : "undefined";
        try {
            const decoded = jwt.verify(token, 'shhhhh')
        } catch (error) {
            throw (error);
        }
    } else {
        throw ("Unauthorized")
    }
}
