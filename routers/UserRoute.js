import { Router } from "express";
import {
  UserAccountCrete,
  UserAccountLogin,
} from "../controllers/UserController.js";
const router = Router();
router.post("/sign_up", UserAccountCrete);
router.post("/login", UserAccountLogin);

export default router;
