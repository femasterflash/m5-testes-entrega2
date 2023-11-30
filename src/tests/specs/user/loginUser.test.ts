import { describe, expect, it } from "vitest";
import { prisma } from "../../../database/prisma";
import { request } from "../../setupFiles";
import { userDefaultExpects } from "../../utils/userDefaultExpects";
import { userMock } from "../../mocks/user.mocks";

const loginUserBeforeEach = async () => {
   const registerUser = await prisma.user.create({ data: userMock });

   return { registerUser };
};

describe("login user", () => {
   it("should be able de login correctly", async () => {
      const { registerUser } = await loginUserBeforeEach();

      const credentials = { email: registerUser.email, password: registerUser.password };

      const data = await request
         .post("/users/login")
         .send(credentials)
         .expect(200)
         .then((response) => response.body);

      expect(data).toBeDefined();
      expect(data).toBeTypeOf("object");

      expect(data.accessToken).toBeDefined();
      expect(data.accessToken).toBeTypeOf("string");

      userDefaultExpects(data.user);
   });

   it("should be throw error when password in wrong", async () => {
      const { registerUser } = await loginUserBeforeEach();

      const credentials = { email: registerUser.email, password: "wrongpassword" };

      await request.post("/users/login").send(credentials).expect(401);
   });

   it("should be throw error when user not found", async () => {
      const credentials = { email: "invalid@email.com", password: "wrongpassword" };

      await request.post("/users/login").send(credentials).expect(404);
   });
});
