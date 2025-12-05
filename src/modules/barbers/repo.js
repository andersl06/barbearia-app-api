import supabase from "../../core/db.js";

export const linkBarber = async (barbershopId, userId, isOwner = false) =>
  supabase.from("barbershop_barbers")
    .insert({
      barbershop_id: barbershopId,
      user_id: userId,
      is_owner: isOwner,
      is_active: true
    })
    .select()
    .single();

export const createProfile = async (payload) =>
  supabase.from("barber_profiles").insert(payload).select().single();

export const list = async (barbershopId) =>
  supabase.from("barbershop_barbers").select("*").eq("barbershop_id", barbershopId);
