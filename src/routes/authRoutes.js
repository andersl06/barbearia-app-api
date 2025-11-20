import { Router } from "express";
import { register, login} from "../controllers/authController.js"

const router = Router();

// POST /api/auth/register -> cria barbeiro
router.post("/register", register);

// POST /api/auth/login -> login
router.post("/login", login);

export default router;
