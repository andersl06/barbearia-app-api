// src/modules/barbers/repo.js
import supabase from "../../core/db.js";

/**
 * Insert profile into `barbers` table
 */
export const createProfile = async (payload) => {
  return supabase
    .from("barbers")
    .insert(payload)
    .select()
    .single();
};

export const findProfileByUserId = async (userId) => {
  return supabase
    .from("barbers")
    .select("*")
    .eq("user_id", userId)
    .single();
};

export const findByBarbershop = async (barbershopId) => {
  return supabase
    .from("barbers")
    .select("*, users:users(user_id, name, email, avatar_url)")
    .eq("barbershop_id", barbershopId);
};

export const updateProfile = async (id, updates) => {
  return supabase
    .from("barbers")
    .update({ ...updates, updated_at: new Date() })
    .eq("id", id)
    .select()
    .single();
};

/**
 * barbershop_barbers link table helpers
 */
export const linkBarberToBarbershop = async (payload) => {
  // payload: { barbershop_id, user_id, is_owner (bool), is_active (bool) }
  return supabase
    .from("barbershop_barbers")
    .insert(payload)
    .select()
    .single();
};

export const findLink = async (barbershopId, userId) => {
  return supabase
    .from("barbershop_barbers")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .eq("user_id", userId)
    .single();
};

export const updateLink = async (id, updates) => {
  return supabase
    .from("barbershop_barbers")
    .update({ ...updates, updated_at: new Date() })
    .eq("id", id)
    .select()
    .single();
};
