// src/modules/availability/service.js
import * as repo from "./repo.js";
import supabase from "../../core/db.js";

export const setAvailability = async (user, barbershopId, barberId, data) => {
  // 1. validar se o barber pertence à barbearia
  const { data: link } = await supabase
    .from("barbershop_barbers")
    .select("user_id, barbershop_id")
    .eq("barbershop_id", barbershopId)
    .eq("user_id", barberId)
    .single();

  if (!link) throw new Error("Barbeiro não pertence à barbearia");

  // 2. regras de permissão
  if (user.role === "barber" && user.id !== barberId) {
    throw new Error("Você só pode alterar sua própria agenda");
  }

  if (user.role === "client") {
    throw new Error("Cliente não pode alterar agenda");
  }

  // 3. montar payload
  const payload = {
    barber_id: barberId,
    day_of_week: data.day_of_week, // segunda, terca etc
    start_time: data.start_time,
    end_time: data.end_time,
    exceptions: data.exceptions || {}
  };

  // 4. salvar no banco
  const { data: availability, error } = await repo.upsert(payload);
  if (error) throw error;

  return availability;
};

export const getAvailability = async (barbershopId, barberId) => {
  const { data, error } = await repo.findByBarber(barberId);
  if (error) throw error;

  return data;
};
