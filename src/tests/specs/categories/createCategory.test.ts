import { describe, expect, it } from "vitest";
import { request } from "../../setupFiles";
import { category, invalidDataCategory } from "../../mocks/category.mocks";
import { generateAuthentication } from "../../utils/generateAuthentication";

describe("create category", async () => {
   it("should be able to create category successfully", async () => {
      const { user, token } = await generateAuthentication();

      const data = await request
         .post("/categories")
         .set("Authorization", `Bearer ${token}`)
         .send(category(user.id))
         .expect(201)
         .then((response) => response.body);

      expect(data).toBeDefined();
      expect(data).toBeTypeOf("object");

      expect(data.id).toBeDefined();
      expect(data.id).toBeTypeOf("number");

      expect(data.name).toBeDefined();
      expect(data.name).toBeTypeOf("string");

      expect(data.userId).toBeDefined();
      expect(data.userId).toBeTypeOf("number");
   });

   it("should throw error when try to create a task with a missing body parameter", async () => {
      const { token } = await generateAuthentication();

      await request
         .post("/categories")
         .set("Authorization", `Bearer ${token}`)
         .expect(409);
   });

   it("should throw error when try to create a task with invalid data types", async () => {
      const { token } = await generateAuthentication();
      
      await request.post("/categories").set("Authorization", `Bearer ${token}`).send(invalidDataCategory).expect(409);
   });
});
