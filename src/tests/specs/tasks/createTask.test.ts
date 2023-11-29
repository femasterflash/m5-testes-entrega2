import { describe, it } from "vitest";
import { request } from "../../setupFiles";
import { taskDefaultExpects } from "../../utils/taskDefaultExpects";
import { invalidDataTask, task, taskWithInvalidCategory } from "../../mocks/tasks.mocks";
import { generateAuthentication } from "../../utils/generateAuthentication";

describe("create task", () => {
   it("should be able to create task sucessfully", async () => {
      const { user, token } = await generateAuthentication();

      const data = await request
         .post("/tasks")
         .set("Authorization", `Bearer ${token}`)
         .send(task)
         .expect(201)
         .then((response) => response.body);

      taskDefaultExpects(data, user.id);
   });

   it("should throw error when try to create a task in a invalid category", async () => {
      const { token } = await generateAuthentication();

      await request
         .post("/tasks")
         .set("Authorization", `Bearer ${token}`)
         .send(taskWithInvalidCategory)
         .expect(403);
   });

   it("should throw error when try to create a task with a missing body parameter", async () => {
      const { token } = await generateAuthentication();

      await request.post("/tasks").set("Authorization", `Bearer ${token}`).expect(409);
   });

   it("should throw error when try to create a task with invalid data types", async () => {
      const { token } = await generateAuthentication();

      await request
         .post("/tasks")
         .set("Authorization", `Bearer ${token}`)
         .send(invalidDataTask)
         .expect(409);
   });
});
