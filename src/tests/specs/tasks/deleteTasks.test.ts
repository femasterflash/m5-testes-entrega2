import { describe, it } from "vitest";
import { prisma } from "../../../database/prisma";
import { task } from "../../mocks/tasks.mocks";
import { request } from "../../setupFiles";
import { generateAuthentication } from "../../utils/generateAuthentication";

const deleteTaskBeforeEach = async () => {
   const { user, token } = await generateAuthentication();

   const deleteTask = await prisma.task.create({ data: { ...task, userId: user.id } });

   return { token, deleteTask };
};

describe("delete task", () => {
   it("should be able to delete task sucessfully", async () => {
      const { token, deleteTask } = await deleteTaskBeforeEach();

      await request
         .delete(`/tasks/${deleteTask?.id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(204);
   });

   it("should throw error when try to delete a invalid task", async () => {
      const { token, deleteTask } = await deleteTaskBeforeEach();

      const id = (deleteTask?.id as number) + 1;

      await request
         .delete(`/tasks/${id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(404);
   });
});
