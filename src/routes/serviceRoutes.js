import { Router } from "express";
import { listservicerBarbershops, createService } from "../controllers/serviceController.js"; 
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Get /api/services/barbershop/:barbershop_id - Listar todos os serviços de uma barbearia específica
router.get("/barbershop/:barbershop_id", listservicerBarbershops);

// Post /api/services/barbershop/:barbershop_id - Criar um novo serviço para uma barbearia específica
router.post("/barbershop/:barbershop_id", authMiddleware, createService);

export default router;
