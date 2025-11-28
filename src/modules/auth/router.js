// src/modules/auth/router.js
import { Router } from "express";
import * as controller from "./controller.js";
import { authTempMiddleware } from "../../shared/authTempMiddleware.js";

const router = Router();

router.post("/register/client", controller.registerClient);
router.post("/register/owner", controller.registerOwner);
router.post("/register/barber", controller.createBarber);

router.post("/login", controller.login);

// rota de troca de senha (somente token temporário)
router.patch(
  "/change-password",
  authTempMiddleware, // aceita apenas token type=password_change
  controller.changePassword
);

export default router;
