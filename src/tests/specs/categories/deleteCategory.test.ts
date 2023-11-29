import { describe, it } from "vitest";
import { request } from "../../setupFiles";
import { prisma } from "../../../database/prisma";
import { generateAuthentication } from "../../utils/generateAuthentication";
import { category } from "../../mocks/category.mocks";

const deleteCategoryBeforeEach = async () => {
   const { user, token } = await generateAuthentication();

   const deleteCategory = await prisma.category.create({
      data: category(user.id),
   });

   return { token, deleteCategory };
};

describe("delete category", () => {
   it("should be able to delete category successfully", async () => {
      const { token, deleteCategory } = await deleteCategoryBeforeEach();

      await request
         .delete(`/categories/${deleteCategory?.id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(204);
   });

   it("should throw error when try to delete a invalid category", async () => {
      const { token, deleteCategory } = await deleteCategoryBeforeEach();

      const id = (deleteCategory?.id as number) + 1;

      await request
         .delete(`/categories/${id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(404);
   });
});
