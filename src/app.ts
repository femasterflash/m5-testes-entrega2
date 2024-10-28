import "express-async-errors";
import "reflect-metadata";

import helmet from "helmet";
import express, { json } from "express";

import { categoryRouter, tasksRouter } from "./routers";
import { handleErrors } from "./middlewares";
import { userRouter } from "./routers/user.router";
import { sessionRouter } from "./routers/session.router";

let cors = require("cors");

export const app = express();

app.use(helmet());
app.use(json());
app.use(cors());

app.use("/tasks", tasksRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);
app.use("/users", sessionRouter);

app.use(handleErrors);
