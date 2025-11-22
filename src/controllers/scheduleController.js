// src/controllers/scheduleController.js
import pool from "../config/db.js";

// Criar novo agendamento
export const createSchedule = async (req, res) => {
  try {
    const { barberId, barbershopId, serviceId, startsAt, endsAt } = req.body;

    // client vem do token (req.user.id)
    const clientId = req.user?.id;

    if (!clientId || !barberId || !barbershopId || !serviceId || !startsAt || !endsAt) {
      return res.status(400).json({
        message:
          "clientId (token), barberId, barbershopId, serviceId, startsAt e endsAt são obrigatórios",
      });
    }

    const result = await pool.query(
      `INSERT INTO schedules
        (client_id, barber_id, barbershop_id, service_id, starts_at, ends_at)
       VALUES
        ($1,        $2,        $3,            $4,        $5,        $6)
       RETURNING
        id,
        client_id     AS "clientId",
        barber_id     AS "barberId",
        barbershop_id AS "barbershopId",
        service_id    AS "serviceId",
        starts_at     AS "startsAt",
        ends_at       AS "endsAt",
        status`,
      [clientId, barberId, barbershopId, serviceId, startsAt, endsAt]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao agendar serviço:", error.message);
    return res.status(500).json({ message: "Erro ao agendar serviço" });
  }
};

// Listar agendamentos de um barbeiro em uma data específica
export const listSchedulesByBarberAndDate = async (req, res) => {
  try {
    const barberId = Number(req.params.barberId);
    const { date } = req.query; // "YYYY-MM-DD"

    if (!date) {
      return res.status(400).json({ message: "Data é obrigatória" });
    }

    const result = await pool.query(
      `SELECT
         id,
         client_id     AS "clientId",
         barber_id     AS "barberId",
         barbershop_id AS "barbershopId",
         service_id    AS "serviceId",
         starts_at     AS "startsAt",
         ends_at       AS "EndsAt",
         status
       FROM schedules
       WHERE barber_id = $1
         AND DATE(starts_at) = $2
       ORDER BY starts_at ASC`,
      [barberId, date]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error.message);
    return res.status(500).json({ message: "Erro ao listar agendamentos" });
  }
};
