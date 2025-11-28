// src/modules/commission/policy.js
import supabase from "../../core/db.js";

export const checkSuspension = async (barbershopId) => {
  const { data: shop } = await supabase
    .from("billing_invoices")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!shop) return { suspended: false };

  const createdAt = new Date(shop.created_at);
  const now = new Date();

  const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);

  if (diffDays > 3) {
    return {
      suspended: true,
      reason: "Pagamento em atraso da fatura"
    };
  }

  return { suspended: false };
};
