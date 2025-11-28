// src/modules/services/router.js
import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router();

// criar serviço
router.post(
  "/:barbershopId",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.create
);

// atualizar serviço
router.patch(
  "/update/:serviceId",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.update
);

// ativar/desativar
router.patch(
  "/status/:serviceId",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.toggleStatus
);

// listar serviços (todos os usuários)
router.get("/:barbershopId", controller.list);

export default router;
