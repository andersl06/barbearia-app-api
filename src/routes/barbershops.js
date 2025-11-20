// src/routes/barbershopRoutes.js
import { Router } from "express";
import pool from "../config/db.js";
<<<<<<< HEAD
=======
import { authMiddleware, requireRole } from "../middlewares/authMiddleware.js";
>>>>>>> 8ed25fe (autenticação feita)

const router = Router();

// POST /api/barbershops
// Cria barbearia (apenas usuário logado com role barber/owner)
router.post(
  "/",
  authMiddleware,
  requireRole("barber", "owner"),
  async (req, res) => {
    const { name, slug, address, is_solo } = req.body;

    try {
      if (!name || !slug) {
        return res
          .status(400)
          .json({ message: "Nome e slug são obrigatórios" });
      }

      // owner_user_id = id do usuário logado
      const ownerUserId = req.user.id;

      const result = await pool.query(
        `INSERT INTO barbershops (name, slug, address, is_solo, owner_user_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, public_id, name, slug, address, is_solo, owner_user_id, created_at`,
        [name, slug, address || null, is_solo ?? false, ownerUserId]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Erro ao criar barbearia:", error.message);
      return res
        .status(500)
        .json({ message: "Erro ao criar barbearia" });
    }
  }
);

<<<<<<< HEAD
});
export default router
=======
export default router;
>>>>>>> 8ed25fe (autenticação feita)
