import { prisma } from "../../database/prisma"
import { user } from "../mocks/user.mocks"
import jwt from "jsonwebtoken";

export const generateAuthentication = async () => {
    const newUser = await prisma.user.create({
        data: user
    })

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);

    return { user: newUser, token };
}