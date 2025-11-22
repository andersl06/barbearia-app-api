// src/routes/scheduleRoutes.js
import { Router } from "express";
import {
  createSchedule,
  listSchedulesByBarberAndDate,
} from "../controllers/scheduleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// cliente cria agendamento (precisa estar logado)
router.post("/", authMiddleware, createSchedule);

// barbeiro vê agenda do dia
router.get("/barber/:barberId", authMiddleware, listSchedulesByBarberAndDate);

export default router;
