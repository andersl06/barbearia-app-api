// src/modules/barbershops/repo.js
import supabase from "../../core/db.js";

export const create = async (payload) => {
  return supabase
    .from("barbershops")
    .insert(payload)
    .select()
    .single();
};

export const update = async (id, payload) => {
  return supabase
    .from("barbershops")
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
    .from("barbershops")
    .select("*")
    .eq("id", id)
    .single();
};

export const findBySlug = async (slug) => {
  return supabase
    .from("barbershops")
    .select("*")
    .eq("slug", slug)
    .single();
};
