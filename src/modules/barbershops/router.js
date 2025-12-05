import { Router } from "express";
import { authMiddleware } from "../../shared/authMiddleware.js";
import * as controller from "./controller.js";

const router = Router();

router.get("/mine", authMiddleware, controller.getMine);
router.get("/:id", controller.getOne);

router.post("/", authMiddleware, controller.create);
router.patch("/:id", authMiddleware, controller.update);

export default router;
