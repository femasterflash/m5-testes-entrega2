import { prisma } from "../../database/prisma"
import { userMock } from "../mocks/user.mocks"
import jwt from "jsonwebtoken";

export const generateAuthentication = async (user = userMock) => {
    const newUser = await prisma.user.create({
        data: user
    })

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string);

    return { user: newUser, token };
}

export const generateInvalidToken = () => {
    const token = jwt.sign({}, "INVALID_SECRET");

    return token;
}