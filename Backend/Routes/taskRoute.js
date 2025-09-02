import express from "express";
import { dataLocked, getTaskPlanByWeekDay, taskPlan } from "../Controllers/taskcontroller.js";
import authUser from "../Middleware/authUser.js";
const taskRouter = express.Router();

taskRouter.post("/taskplan", authUser,taskPlan);
taskRouter.get("/taskplan/:week/:day", authUser, getTaskPlanByWeekDay);
taskRouter.put("/taskplan/:week/:day/lock", authUser, dataLocked);
export default taskRouter;