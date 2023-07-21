import { Router } from "express";
import {
  CreateNewTask,
  UpdateTask,
  DeleteTask,
  GetAllTaskWithAPI,
  GetSpecificTaskWthAPI,
} from "../controllers/TaskController.js";

const router = Router();

router.post("/:userId/create_task", CreateNewTask);
router.get("/:userId/get_tasks", GetAllTaskWithAPI);
router.get("/get_specific_task/:taskId", GetSpecificTaskWthAPI);
router.put("/update_task/:taskId", UpdateTask);
router.delete("/delete_task/:taskId", DeleteTask);

export default router;
