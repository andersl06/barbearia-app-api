import supabase from "../../core/db.js";

export const add = (payload) =>
  supabase.from("favorites").insert(payload).select().single();

export const remove = (clientId, barbershopId) =>
  supabase
    .from("favorites")
    .delete()
    .eq("client_id", clientId)
    .eq("barbershop_id", barbershopId);

export const list = (clientId) =>
  supabase
    .from("favorites")
    .select(`
      barbershop_id,
      barbershops(id, name, logo_url, city, state)
    `)
    .eq("client_id", clientId);
