import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";
import { enforceBarbershopActive } from "./middleware.js";

const router = Router();

router.get("/preview", controller.preview);

router.get(
  "/invoice/:barbershopId",
  authMiddleware,
  roleMiddleware(["owner", "admin"]),
  enforceBarbershopActive,
  controller.getInvoice
);

router.post(
  "/invoice/:barbershopId",
  authMiddleware,
  roleMiddleware(["owner", "admin"]),
  enforceBarbershopActive,
  controller.generate
);

export default router;
