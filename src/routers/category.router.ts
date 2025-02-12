import { Router } from "express";
import { auth, ensure } from "../middlewares";
import { categoryCreateSchema } from "../schemas";
import { CategoryController } from "../controllers/CategoryController";
import { permission } from "../middlewares/permission.middleware";

export const categoryRouter = Router();

const controller = new CategoryController();

categoryRouter.post(
  "",
  auth.isAuthenticated,
  ensure.validBody(categoryCreateSchema),
  controller.create
);

categoryRouter.get("", auth.isAuthenticated, controller.read);

categoryRouter.use(
  "/:categoryId",
  auth.isAuthenticated,
  ensure.categoryIdExists,
  permission.isOwnerCategoryId
);

categoryRouter.get("/:categoryId", controller.retrieve);

categoryRouter.delete("/:categoryId", controller.delete);
