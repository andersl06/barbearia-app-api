import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router({ mergeParams: true });

router.post(
  "/:barbershopId/barbers",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.create
);

router.get("/:barbershopId/barbers", controller.list);

router.patch(
  "/:barbershopId/barbers/:userId",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.patch
);

router.post(
  "/:barbershopId/link-owner",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.linkOwner
);

export default router;
