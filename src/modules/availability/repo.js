// src/modules/availability/repo.js
import supabase from "../../core/db.js";

export const upsert = async (payload) => {
  return supabase
    .from("availability")
    .upsert(payload)
    .select()
    .single();
};

export const findByBarber = async (barberId) => {
  return supabase
    .from("availability")
    .select("*")
    .eq("barber_id", barberId)
    .single();
};
