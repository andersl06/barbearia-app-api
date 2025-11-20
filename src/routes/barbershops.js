import { Router } from "express";
import pool from "..config/db.js";

const router = Router ()


//Post api/barbershops
router.post("/", async (req, res) => {
    const { name, slug, address, is_solo, owner_user_id } = req.body;

    try {
        if (!name || !slug) {
        return res
            .status(400)
            .json({ message: "Nome e slug são obrigatórios" });
    }

    const result = await pool.query(
      `INSERT INTO barbershops (name, slug, address, is_solo, owner_user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, public_id, name, slug, address, is_solo, owner_user_id, created_at`,
      [name, slug, address || null, is_solo ?? false, owner_user_id || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar barbearia:", error.message);
    return res
      .status(500)
      .json({ message: "Erro ao criar barbearia" });
  }

});
export default router