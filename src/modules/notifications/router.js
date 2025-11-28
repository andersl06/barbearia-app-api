import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, controller.list);
router.patch("/:id", authMiddleware, controller.markAsRead);

export default router;
