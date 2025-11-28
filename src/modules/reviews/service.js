import * as repo from "./repo.js";
import supabase from "../../core/db.js";

export const create = async (clientId, data) => {
  // Validação: cliente só pode avaliar se teve booking concluído
  const { data: pastBooking } = await supabase
    .from("schedules")
    .select("id")
    .eq("client_id", clientId)
    .eq("barbershop_id", data.barbershop_id)
    .eq("status", "completed")
    .limit(1)
    .single();

  if (!pastBooking) throw new Error("Cliente não pode avaliar sem agendamento concluído");

  return repo.createReview({
    ...data,
    client_id: clientId,
    created_at: new Date().toISOString()
  });
};

export const barberReply = async (barberId, reviewId, reply) => {
  // Verificar se esse review pertence a um barber do owner
  return repo.updateReviewReply(reviewId, reply);
};

export const listByBarbershop = (id) => repo.listByBarbershop(id);
export const listByBarber = (id) => repo.listByBarber(id);
