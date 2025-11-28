// src/modules/auth/repo.js
import supabase from "../../core/db.js";

export const findByEmail = async (email) => {
  return supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
};

export const createUser = async (payload) => {
  return supabase
    .from("users")
    .insert(payload)
    .select()
    .single();
};

export const updatePassword = async (userId, password_hash) => {
  return supabase
    .from("users")
    .update({
      password_hash,
      must_change_password: false,
      updated_at: new Date(),
    })
    .eq("id", userId)
    .select()
    .single();
};
