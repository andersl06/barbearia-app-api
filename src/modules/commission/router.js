// src/modules/commission/router.js
import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router();

// cliente vê valor da taxa no checkout
router.get(
  "/preview",
  controller.preview
);

// owner gera invoice mensal
router.get(
  "/invoice/:barbershopId",
  authMiddleware,
  roleMiddleware(["owner", "admin"]),
  controller.generateInvoice
);

export default router;
