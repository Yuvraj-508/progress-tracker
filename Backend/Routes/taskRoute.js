import express from "express";
import { dataLocked, getTaskPlanByWeekDay, taskPlan } from "../Controllers/taskcontroller.js";
import authUser from "../Middleware/authUser.js";
import { createRoadmap, getRoadmapByWeek, getRoadmaps, roadDataLocked } from "../Controllers/Roadmap.js";
const taskRouter = express.Router();

taskRouter.put("/taskplan", authUser,taskPlan);
taskRouter.post("/taskplan", authUser,taskPlan);
taskRouter.get("/taskplan/:week/:day", authUser, getTaskPlanByWeekDay);
taskRouter.put("/taskplan/:week/:day/lock", authUser, dataLocked);
taskRouter.post("/roadmap", authUser, createRoadmap);
taskRouter.put("/roadmap", authUser, createRoadmap);
taskRouter.get("/roadmaps", authUser, getRoadmaps);
taskRouter.get("/roadmap", authUser, getRoadmapByWeek);
taskRouter.put("/roadmap/lock", authUser, roadDataLocked);
export default taskRouter;