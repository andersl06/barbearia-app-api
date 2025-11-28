// src/modules/categories/router.js
import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router();

// criar categoria (owner)
router.post(
  "/:barbershopId",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.create
);

// listar categorias (todos podem ver)
router.get("/:barbershopId", controller.list);

// atualizar categoria (owner)
router.patch(
  "/:barbershopId/:categoryId",
  authMiddleware,
  roleMiddleware(["owner"]),
  controller.update
);

export default router;
