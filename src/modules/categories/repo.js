// src/modules/categories/repo.js
import supabase from "../../core/db.js";

export const create = async (payload) => {
  return supabase
    .from("service_categories")
    .insert(payload)
    .select()
    .single();
};

export const list = async (barbershopId) => {
  return supabase
    .from("service_categories")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .order("name", { ascending: true });
};

export const findById = async (id) => {
  return supabase
    .from("service_categories")
    .select("*")
    .eq("id", id)
    .single();
};

export const update = async (id, payload) => {
  return supabase
    .from("service_categories")
    .update({
      ...payload,
      updated_at: new Date()
    })
    .eq("id", id)
    .select()
    .single();
};
