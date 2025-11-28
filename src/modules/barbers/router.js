// src/modules/barbers/router.js
import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router({ mergeParams: true });

// Owner cria barbeiro para a barbearia
router.post(
  "/:barbershopId/barbers",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.create
);

// Listar barbeiros da barbearia
router.get("/:barbershopId/barbers", controller.list);

// Atualizar vínculo / ativar / desativar / profile (somente owner)
router.patch(
  "/:barbershopId/barbers/:userId",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.patch
);

// Owner vira barbeiro (link-owner)
router.post(
  "/:barbershopId/link-owner",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.linkOwner
);

export default router;
