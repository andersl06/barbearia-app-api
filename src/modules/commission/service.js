import supabase from "../../core/db.js";
import dayjs from "dayjs";

/**
 * Calcula comissão padrão sobre o preço do serviço
 */
export function calculateCommission(servicePrice) {
  const percent = 10; // Exemplo: 10%
  const value = Number((servicePrice * (percent / 100)).toFixed(2));

  return {
    percent,
    commission_value: value,
  };
}

/**
 * Registrar uma transação (um corte realizado)
 */
export async function registerTransaction({ schedule_id, barbershop_id, service_price, paid_online }) {
  const { percent, commission_value } = calculateCommission(service_price);

  return supabase
    .from("billing_transactions")
    .insert({
      schedule_id,
      barbershop_id,
      service_price,
      commission_percent: percent,
      commission_value,
      paid_online: paid_online ?? false,
    })
    .select()
    .single();
}

/**
 * Gera ou atualiza uma fatura do mês
 */
export async function generateInvoice(barbershopId, month) {
  const targetMonth = month || dayjs().format("YYYY-MM");

  // Buscar transações do mês
  const { data: transactions } = await supabase
    .from("billing_transactions")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .gte("created_at", `${targetMonth}-01`)
    .lte("created_at", `${targetMonth}-31`);

  const total = (transactions || [])
    .reduce((acc, t) => acc + Number(t.commission_value), 0);

  // Upsert da fatura
  const { data: invoice } = await supabase
    .from("billing_invoices")
    .upsert(
      {
        barbershop_id: barbershopId,
        month: targetMonth,
        total_commission: total,
        status: "pending",
      },
      { onConflict: "barbershop_id,month" }
    )
    .select()
    .single();

  // Registrar métricas
  await supabase.from("usage_metrics").upsert(
    {
      barbershop_id: barbershopId,
      month: targetMonth,
      appointments: transactions.length,
      commission_rate: 10,
    },
    { onConflict: "barbershop_id,month" }
  );

  return invoice;
}

/**
 * Ver invoice atual
 */
export async function getInvoice(barbershopId, month) {
  const targetMonth = month || dayjs().format("YYYY-MM");
  return supabase
    .from("billing_invoices")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .eq("month", targetMonth)
    .maybeSingle();
}

