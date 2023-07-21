import { Router } from "express";
import UserRoutes from "./UserRoute.js";
import TaskRoute from "./TaskRoute.js";
const router = Router();
router.get("/", (req, res) => {
  return res.send("Success");
});

router.use("/user", UserRoutes);
router.use("/task", TaskRoute);

export default router;
