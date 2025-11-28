// src/modules/bookings/router.js
import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router();

// criar booking (cliente)
router.post(
  "/:barbershopId",
  authMiddleware,
  roleMiddleware(["client"]),
  controller.create
);

// listar bookings do barbeiro (barbeiro / owner)
router.get(
  "/:barbershopId/barber/:barberId",
  authMiddleware,
  roleMiddleware(["barber","owner"]),
  controller.listByBarber
);

// listar bookings da barbearia (owner / admin)
router.get(
  "/:barbershopId",
  authMiddleware,
  roleMiddleware(["owner","admin"]),
  controller.listByBarbershop
);

// cancelar booking (cliente/barber/owner)
router.patch(
  "/:barbershopId/cancel/:bookingId",
  authMiddleware,
  controller.cancel
);

// alterar status (confirmar, completed) (barber/owner)
router.patch(
  "/:barbershopId/status/:bookingId",
  authMiddleware,
  roleMiddleware(["barber","owner"]),
  controller.changeStatus
);

export default router;
