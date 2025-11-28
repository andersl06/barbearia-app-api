import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";

const router = Router();

router.post("/:id", authMiddleware, controller.favorite);
router.delete("/:id", authMiddleware, controller.unfavorite);
router.get("/", authMiddleware, controller.list);

export default router;
