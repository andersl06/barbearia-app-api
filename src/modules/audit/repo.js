// src/modules/audit/repo.js
import supabase from "../../core/db.js";

export const insert = async (payload) => {
  return supabase
    .from("audit_logs")
    .insert(payload)
    .select()
    .single();
};
