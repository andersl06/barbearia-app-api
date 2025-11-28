// src/modules/services/repo.js
import supabase from "../../core/db.js";

export const create = async (payload) => {
  return supabase
    .from("services")
    .insert(payload)
    .select()
    .single();
};

export const update = async (id, payload) => {
  return supabase
    .from("services")
    .update({
      ...payload,
      updated_at: new Date()
    })
    .eq("id", id)
    .select()
    .single();
};

export const findById = async (id) => {
  return supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();
};

export const listByBarbershop = async (barbershopId) => {
  return supabase
    .from("services")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .order("name", { ascending: true });
};
