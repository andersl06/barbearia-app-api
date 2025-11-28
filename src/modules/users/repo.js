// src/modules/users/repo.js
import supabase from "../../core/db.js";

export const getById = async (id) => {
  return supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
};

export const update = async (id, payload) => {
  return supabase
    .from("users")
    .update({
      ...payload,
      updated_at: new Date()
    })
    .eq("id", id)
    .select()
    .single();
};
