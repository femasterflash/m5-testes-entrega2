import { describe, expect, it } from "vitest";
import { prisma } from "../../../database/prisma";
import { category } from "../../mocks/category.mocks";
import { getTaskList } from "../../mocks/tasks.mocks";
import { request } from "../../setupFiles";
import { taskDefaultExpects } from "../../utils/taskDefaultExpects";
import { categoryDefaultExpects } from "../../utils/categoryDefaultExpects";
import { generateAuthentication } from "../../utils/generateAuthentication";

const getTasksBeforeEach = async () => {
   const { user, token } = await generateAuthentication();

   await prisma.category.create({ data: category(user.id) });
   const taskList = await getTaskList(user.id);
   await prisma.task.createMany({ data: taskList });

   return { user, token };
};

describe("get tasks", () => {
   it("should be able to get tasks successfully", async () => {
      const { user, token } = await getTasksBeforeEach();

      const data = await request
         .get("/tasks")
         .set("Authorization", `Bearer ${token}`)
         .expect(200)
         .then((response) => response.body);

      expect(data).toHaveLength(2);

      taskDefaultExpects(data[0], user.id);

      expect(data[0].category).toBeNull();

      taskDefaultExpects(data[1], user.id);

      categoryDefaultExpects(data[1].category);
   });

   it("should be able to get tasks from specific category", async () => {
      const { user, token } = await getTasksBeforeEach();

      const getCategory = await prisma.category.findFirst();

      const data = await request
         .get(`/tasks?category=${getCategory?.id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(200)
         .then((response) => response.body);

      expect(data).toHaveLength(1);

      taskDefaultExpects(data[0], user.id);

      categoryDefaultExpects(data[0].category);
   });

   it("should throw error when you try to get tasks from a invalid category", async () => {
      const { token } = await getTasksBeforeEach();

      const getCategory = await prisma.category.findFirst();

      const id = (getCategory?.id as number) + 1;

      await request
         .get(`/tasks?category=${id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(404);
   });

   it("should be able to get a single task by the id correctly", async () => {
      const { user, token } = await getTasksBeforeEach();

      const tasks = await prisma.task.findMany();

      const data = await request
         .get(`/tasks/${tasks[1].id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(200)
         .then((response) => response.body);

      taskDefaultExpects(data, user.id);

      categoryDefaultExpects(data.category);
   });

   it("should be throw error when try get a task with a invalid id", async () => {
      const { token } = await getTasksBeforeEach();

      const tasks = await prisma.task.findMany();

      const id = tasks[1].id + 1;

      await request
         .get(`/tasks/${id}`)
         .set("Authorization", `Bearer ${token}`)
         .expect(404);
   });
});
