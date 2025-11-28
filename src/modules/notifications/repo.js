import supabase from "../../core/db.js";

export const create = (payload) =>
  supabase.from("notifications").insert(payload).select().single();

export const list = (userId) =>
  supabase.from("notifications").select("*").eq("user_id", userId);

export const markAsRead = (id) =>
  supabase.from("notifications").update({ status: "read" }).eq("id", id);
