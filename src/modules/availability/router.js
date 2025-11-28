// src/modules/availability/router.js
import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";

const router = Router();

// criar/editar disponibilidade (barbeiro ou owner)
router.post(
  "/:barbershopId/barber/:barberId",
  authMiddleware,
  controller.set
);

// listar disponibilidade (cliente pode ver)
router.get(
  "/:barbershopId/barber/:barberId",
  controller.get
);

export default router;
