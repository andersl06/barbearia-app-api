// src/controllers/barbershopController.js
import pool from "../config/db.js";

export const listBarbershops = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         address,
         city,
         neighborhood,
         phone,
         logo_url         AS "logoUrl",
         cover_url        AS "coverUrl",
         avg_price        AS "avgPrice",
         avg_time_minutes AS "avgTimeMinutes"
       FROM barbershops
       WHERE status = 'active'
       ORDER BY id ASC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar barbearias:", error.message);
    return res.status(500).json({ message: "Erro ao listar barbearias" });
  }
};

export const getBarbershopById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      `SELECT
         id,
         name,
         address,
         city,
         neighborhood,
         phone,
         logo_url         AS "logoUrl",
         cover_url        AS "coverUrl",
         avg_price        AS "avgPrice",
         avg_time_minutes AS "avgTimeMinutes"
       FROM barbershops
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Barbearia não encontrada" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar barbearia:", error.message);
    return res.status(500).json({ message: "Erro ao buscar barbearia" });
  }
};

export const createBarbershop = async (req, res) => {
  try {
    const {
      name,
      cnpj,
      address,
      city,
      neighborhood,
      phone,
      avgPrice,
      avgTimeMinutes,
      lat,
      lng,
      logoUrl,
      coverUrl,
    } = req.body;

    if (!name || !address) {
      return res
        .status(400)
        .json({ message: "Nome e endereço são obrigatórios" });
    }

    const ownerId = req.user?.id ?? null;

    const result = await pool.query(
      `INSERT INTO barbershops
        (owner_id, name, cnpj, address, city, neighborhood, phone,
         avg_price, avg_time_minutes, lat, lng, logo_url, cover_url)
       VALUES
        ($1,       $2,   $3,  $4,     $5,   $6,          $7,
         $8,        $9,               $10, $11, $12,      $13)
       RETURNING
        id,
        name,
        address,
        city,
        neighborhood,
        phone,
        logo_url         AS "logoUrl",
        cover_url        AS "coverUrl",
        avg_price        AS "avgPrice",
        avg_time_minutes AS "avgTimeMinutes"`,
      [
        ownerId,
        name,
        cnpj,
        address,
        city,
        neighborhood,
        phone,
        avgPrice,
        avgTimeMinutes,
        lat,
        lng,
        logoUrl,
        coverUrl,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar barbearia:", error.message);
    return res.status(500).json({ message: "Erro ao cadastrar barbearia" });
  }
};
