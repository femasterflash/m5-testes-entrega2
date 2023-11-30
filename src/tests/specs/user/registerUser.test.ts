import { describe, expect, it } from "vitest";
import { request } from "../../setupFiles";
import { userDefaultExpects } from "../../utils/userDefaultExpects";
import { prisma } from "../../../database/prisma";
import { userMock, invalidDataUserMock } from "../../mocks/user.mocks";

describe("register user", () => {
   it("should be able to register a user sucessfully", async () => {
      const data = await request
         .post("/users")
         .send(userMock)
         .expect(201)
         .then((response) => response.body);

      userDefaultExpects(data);

      expect(data.password).toBeUndefined();
   });

   it("should not be able to register a user with the same email", async () => {
      await prisma.user.create({ data: userMock });

      await request.post("/users").send(userMock).expect(403);
   });

   it("should throw error when try to register a user with a missing body parameter", async () => {
      await request.post("/users").expect(409);
   });

   it("should throw error when try to register a user with invalid data types", async () => {
      await request.post("/users").send(invalidDataUserMock).expect(409);
   });
});
