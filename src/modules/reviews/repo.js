import supabase from "../../core/db.js";

export const createReview = (payload) => {
  return supabase.from("reviews").insert(payload).select().single();
};

export const listByBarbershop = (barbershopId) => {
  return supabase
    .from("reviews")
    .select("*, users(id, name, avatar_url)")
    .eq("barbershop_id", barbershopId)
    .order("created_at", { ascending: false });
};

export const listByBarber = (barberId) => {
  return supabase
    .from("schedules")
    .select(`
      id,
      service_id,
      client_id,
      barbershop_id,
      reviews(*, users(id, name, avatar_url))
    `)
    .eq("barber_id", barberId);
};

export const updateReviewReply = (reviewId, reply) => {
  return supabase
    .from("reviews")
    .update({ reply })
    .eq("id", reviewId)
    .select()
    .single();
};
