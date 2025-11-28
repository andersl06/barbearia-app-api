import { Router } from "express";
import {
  registerClient,
  registerOwner,
  createBarber,
  login,
  changePassword
} from "./controller.js";

import { authMiddleware } from "../../shared/authMiddleware.js";
import { authTempMiddleware } from "../../shared/authTempMiddleware.js";

const router = Router();

// Registro
router.post("/register/client", registerClient);
router.post("/register/owner", registerOwner);
router.post("/register/barber", authMiddleware, createBarber);

// Login
router.post("/login", login);

// Alterar senha temporária
router.patch("/change-password", authTempMiddleware, changePassword);

export default router;
