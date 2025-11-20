// src/routes/authRoutes.js
import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import pool from "../config/db.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// GET /api/auth/me -> retorna dados do usuário logado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, gender, slug, barbershop_id
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Erro no /me:", error.message);
    return res.status(500).json({ message: "Erro ao buscar usuário" });
  }
});

export default router;
