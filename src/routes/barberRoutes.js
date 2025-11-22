// src/routes/barberRoutes.js
import { Router } from "express";
import {
  listBarbershops,
  getBarbershopById,
  createBarbershop,
} from "../controllers/barbershopController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// lista todas as barbearias
router.get("/", listBarbershops);

// detalhes de uma barbearia
router.get("/:id", getBarbershopById);

// cadastra barbearia
router.post("/", authMiddleware, createBarbershop);

export default router;
