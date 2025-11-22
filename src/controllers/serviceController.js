import pool from "../config/db.js"

// Listar todos os serviços de uma barbearia específica
export const listservicerBarbershops = async (req, res) => {
    try {
        const barbershop_id = Number(req.params.barbershop_id);

        const result = await pool.query(
            `SELECT
                id,
                barbershop_id AS "barbershopId",
                name,
                description,
                price,
                duration_minutes AS "durationMinutes"
            FROM services
            WHERE barbershop_id = $1
            ORDER BY id ASC`,
            [barbershop_id]
        );

        return res.json(result.rows);
    } catch (error) {
        console.error("Erro ao listar serviços da barbearia:", error.message);
        return res.status(500).json({ message: "Erro ao listar serviços da barbearia" });
    }
};

// Criar um novo serviço para uma barbearia específica
export const createService = async (req, res) => {
    try {
        const barbershop_id = Number(req.params.barbershop_id);
        const { name, description, price, durationMinutes } = req.body;

        if (!name || !price || !durationMinutes) {
            return res.status(400).json({ message: "Nome, preço e duração são obrigatórios" });
        }

        const result = await  pool.query(
            `INSERT INTO services (barbershop_id, name, description, price, duration_minutes)
            VALUES ($1, $2, $3, $4, $5)
            returning id, barbershop_id AS "barbershopId", name, description, price, duration_minutes AS "durationMinutes"`,
            [barbershop_id, name, description, price, durationMinutes]
        );
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao cadastrar serviço:", error.message);
        return res.status(500).json({ message: "Erro ao cadastrar serviço" });
    }
};
