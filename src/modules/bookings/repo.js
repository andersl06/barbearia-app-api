// src/modules/bookings/repo.js
import supabase from "../../core/db.js";

export const createBooking = async (payload) => {
  // payload: { barbershop_id, barber_id, client_id, service_id, starts_at, ends_at, status }
  return supabase
    .from("schedules")
    .insert(payload)
    .select()
    .single();
};

export const findConflicts = async (barberId, startsAtIso, endsAtIso) => {
  // busca agendamentos que comecem antes do endsAt e terminem depois do startsAt (overlap)
  return supabase
    .from("schedules")
    .select("*")
    .eq("barber_id", barberId)
    .neq("status", "cancelled") // considerar outros status exceto cancelado
    .lt("starts_at", endsAtIso)
    .gt("ends_at", startsAtIso);
};

export const findByBarberAndMonth = async (barberId, fromIso, toIso) => {
  return supabase
    .from("schedules")
    .select("*")
    .eq("barber_id", barberId)
    .gte("starts_at", fromIso)
    .lte("starts_at", toIso)
    .order("starts_at", { ascending: true });
};

export const findByBarbershop = async (barbershopId, opts = {}) => {
  const q = supabase
    .from("schedules")
    .select("*")
    .eq("barbershop_id", barbershopId);
  if (opts.from) q.gte("starts_at", opts.from);
  if (opts.to) q.lte("starts_at", opts.to);
  return q.order("starts_at", { ascending: true });
};

export const findById = async (id) => {
  return supabase
    .from("schedules")
    .select("*")
    .eq("id", id)
    .single();
};

export const updateStatus = async (id, updates) => {
  return supabase
    .from("schedules")
    .update({ ...updates, updated_at: new Date() })
    .eq("id", id)
    .select()
    .single();
};
