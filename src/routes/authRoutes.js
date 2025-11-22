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
      `SELECT id, name, email, role, gender, avatar_url AS "avatarUrl", status
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

// PATCH /api/auth/status
router.patch("/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // 'active' ou 'inactive'

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Status inválido" });
    }

    await pool.query(
      `UPDATE users
       SET status = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [status, req.user.id]
    );

    return res.json({ message: "Status atualizado com sucesso", status });
  } catch (error) {
    console.error("Erro ao atualizar status:", error.message);
    return res.status(500).json({ message: "Erro ao atualizar status" });
  }
});

export default router;
