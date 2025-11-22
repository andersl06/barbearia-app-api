import pool from "../config/db.js";

// Listar todos os serviços de uma barbearia específica
export const listServicesByBarbershop = async (req, res) => {
  try {
    // se sua rota for /barbershop/:barbershopId
    const barbershop_Id = Number(req.params.barbershop_Id);

    const result = await pool.query(
      `SELECT
         id,
         barbershop_id    AS "barbershopId",
         name,
         description,
         price,
         duration_minutes AS "durationMinutes",
         is_popular       AS "isPopular",
         is_active        AS "isActive"
       FROM services
       WHERE barbershop_id = $1
         AND is_active = true
       ORDER BY price ASC`,
      [barbershop_Id]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar serviços da barbearia:", error.message);
    return res
      .status(500)
      .json({ message: "Erro ao listar serviços da barbearia" });
  }
};

// Criar um novo serviço para uma barbearia específica
export const createService = async (req, res) => {
  try {
    // mesma coisa aqui: pega barbershopId da rota
    const barbershop_Id = Number(req.params.barbershop_Id);

    const {
      name,
      description,
      price,
      durationMinutes,
      isPopular, // opcional no body
    } = req.body;

    if (!name || !price || !durationMinutes) {
      return res
        .status(400)
        .json({ message: "Nome, preço e duração são obrigatórios" });
    }

    const result = await pool.query(
      `INSERT INTO services 
        (barbershop_id, name, description, price, duration_minutes, is_popular)
       VALUES 
        ($1,            $2,   $3,         $4,    $5,              $6)
       RETURNING
        id,
        barbershop_id    AS "barbershopId",
        name,
        description,
        price,
        duration_minutes AS "durationMinutes",
        is_popular       AS "isPopular",
        is_active        AS "isActive"`,
      [
        barbershopId,
        name,
        description,
        price,
        durationMinutes,
        isPopular ?? false,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar serviço:", error.message);
    return res
      .status(500)
      .json({ message: "Erro ao cadastrar serviço" });
  }
};
