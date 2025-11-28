import { Router } from "express";
import * as controller from "./controller.js";
import { authMiddleware } from "../../shared/authMiddleware.js";
import { roleMiddleware } from "../../shared/roleMiddleware.js";

const router = Router();

// Cliente avalia
router.post("/", authMiddleware, roleMiddleware(["client"]), controller.create);

// Listar avaliações da barbearia
router.get("/barbershop/:barbershopId", controller.listByBarbershop);

// Listar avaliações de um barbeiro
router.get("/barber/:barberId", controller.listByBarber);

// Barber responde comentário
router.patch(
  "/reply/:reviewId",
  authMiddleware,
  roleMiddleware(["barber", "owner"]),
  controller.reply
);

export default router;
