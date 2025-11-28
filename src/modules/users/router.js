// src/modules/users/router.js
import { Router } from "express";
import { me, updateMe } from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, me);
router.patch("/me", authMiddleware, updateMe);

export default router;
