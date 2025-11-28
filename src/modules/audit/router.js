// src/modules/audit/router.js
import { Router } from "express";
import { list } from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router();

// apenas admin pode ver logs
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  list
);

export default router;
