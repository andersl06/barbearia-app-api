// src/modules/barbershops/router.js
import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router();

// owner cria barbearia
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.create
);

// owner atualiza barbearia
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.update
);

// buscar por ID
router.get("/:id", controller.getOne);

// buscar por slug
router.get("/slug/:slug", controller.getBySlug);

export default router;
