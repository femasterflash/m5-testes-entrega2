import { describe, expect, it } from "vitest";
import { request } from "../../setupFiles";
import { getTaskList, invalidDataUpdateTask, updateTask } from "../../mocks/tasks.mocks";
import { prisma } from "../../../database/prisma";
import { category } from "../../mocks/category.mocks";
import { taskDefaultExpects } from "../../utils/taskDefaultExpects";
import { generateAuthentication } from "../../utils/generateAuthentication";

const updateTaskBeforeEach = async () => {
   const { user, token } = await generateAuthentication();

   await prisma.category.create({ data: category(user.id) });
   const taskList = await getTaskList(user.id);
   await prisma.task.createMany({ data: taskList });

   return { user, token };
};

describe("update task", () => {
   it("should be able to update task successfully ", async () => {
      const { user, token } = await updateTaskBeforeEach();

      const task = await prisma.task.findFirst();

      const data = await request
         .patch(`/tasks/${task?.id}`)
         .set("Authorization", `Bearer ${token}`)
         .send(updateTask)
         .expect(200)
         .then((response) => response.body);

      taskDefaultExpects(data, user.id);

      expect(data.title).toBe(updateTask.title);
      expect(data.content).toBe(updateTask.content);
      expect(data.finished).toBe(updateTask.finished);
   });

   it("should throw error when try to update a invalid task", async () => {
      const { token } = await updateTaskBeforeEach();

      const tasks = await prisma.task.findMany();

      const id = tasks[1].id + 1;

      await request
         .patch(`/tasks/${id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(404)
         .then((response) => response.body);
   });

   it("should throw error when try to update a task with invalid data types", async () => {
      const { token } = await updateTaskBeforeEach();

      const task = await prisma.task.findFirst();

      await request
         .patch(`/tasks/${task?.id}`)
         .set("Authorization", `Bearer ${token}`)
         .send(invalidDataUpdateTask)
         .expect(409);
   });
});
