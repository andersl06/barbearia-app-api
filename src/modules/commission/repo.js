// src/modules/commission/repo.js
import supabase from "../../core/db.js";

export const createTransaction = async (payload) => {
  return supabase
    .from("billing_transactions")
    .insert(payload)
    .select()
    .single();
};

export const countMonthlyBookings = async (barbershopId, month) => {
  return supabase
    .from("usage_metrics")
    .select("appointments")
    .eq("barbershop_id", barbershopId)
    .eq("month", month)
    .maybeSingle();
};

export const upsertUsage = async (payload) => {
  return supabase
    .from("usage_metrics")
    .upsert(payload)
    .select()
    .single();
};

export const createInvoice = async (payload) => {
  return supabase
    .from("billing_invoices")
    .insert(payload)
    .select()
    .single();
};

export const listTransactionsForMonth = async (barbershopId, month) => {
  return supabase
    .from("billing_transactions")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .ilike("created_at", `${month}%`)
    .order("created_at", { ascending: true });
};
