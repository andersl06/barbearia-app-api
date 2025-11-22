import { Router } from "express";
import {
  listServicesByBarbershop,
  createService,
} from "../controllers/serviceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// GET /api/services/barbershop/1
router.get("/barbershop/:barbershop_Id", listServicesByBarbershop);

// POST /api/services/barbershop/1
router.post("/barbershop/:barbershop_Id", authMiddleware, createService);

export default router;
