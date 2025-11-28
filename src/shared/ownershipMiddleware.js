import pool from "../config/db.js";

// Middleware para verificar se o usuário é proprietário da barbearia
export const isOwnerOfBarbershop = async (req, res, next) => {
  try {
    const userId = Number(req.user?.id);
    const barbershopId = Number(req.params.barbershopId || req.body.barbershopId);

    if (!userId || !barbershopId) {
      return res.status(400).json({ message: "ownerId ou barbershopId ausente" });
    }

    const result = await pool.query(
      `SELECT 1 FROM barbershop_barbers
       WHERE barbershop_id = $1 AND user_id = $2 AND is_owner = true AND is_active = true`,
      [barbershopId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Ação permitida somente para o proprietário" });
    }

    next();
  } catch (error) {
    console.error("isOwnerOfBarbershop error:", error.message);
    return res.status(500).json({ message: "Erro interno de autorização" });
  }
};

// Middleware para verificar se o usuário é proprietário da barbearia
export const isBarberOfBarbershop = async (req, res, next) => {
  try {
    const userId = Number(req.user?.id);
    const barbershopId = Number(req.params.barbershopId || req.body.barbershopId || req.query.barbershopId);

    if (!userId || !barbershopId) {
      return res.status(400).json({ message: "barberId ou barbershopId ausente" });
    }

    const result = await pool.query(
      `SELECT 1 FROM barbershop_barbers
       WHERE barbershop_id = $1 AND user_id = $2 AND is_active = true`,
      [barbershopId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Ação permitida somente para barbeiros vinculados" });
    }

    next();
  } catch (error) {
    console.error("isBarberOfBarbershop error:", error.message);
    return res.status(500).json({ message: "Erro interno de autorização" });
  }
};