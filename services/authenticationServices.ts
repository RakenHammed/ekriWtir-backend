import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const login = async (req: Request, res: Response) => {
    try {
        const dbUser: User = await checkEmail(req.body.email);
        checkPassword(req.body.password, dbUser.password);
        const user = {
            id: dbUser.id,
            email: dbUser.email,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            phoneNumber: dbUser.phoneNumber,
            nationalId: dbUser.nationalId,
            birthDate: dbUser.birthDate,
            isRenter: dbUser.isRenter,
            isRentee: dbUser.isRentee,
            isAdministrator: dbUser.isAdministrator,
        };
        const token = jwt.sign(user, "shhhhh");
        res.status(201).json(token);
    } catch (error) {
        res.status(500).json({
            error,
            message: error,
        });
    }
};

function checkPassword(password: string, hash: string) {
    if (!bcrypt.compareSync(password, hash)) {
        throw new Error(("wrong password"));
    }
}

async function checkEmail(email: string): Promise<User> {
    const user = await User.scope("auth").findOne({
        where: { email },
    });
    if (!user) {
        throw new Error(("email does not exist"));
    } else {
        return user;
    }
}
