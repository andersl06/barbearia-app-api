// src/modules/commission/service.js
import * as repo from "./repo.js";

/**
 * Calcula comissão de serviço.
 */
export const calcCommission = (service_price) => {
  const commission_percent = 5;
  const commission_value = Number((service_price * 0.05).toFixed(2));
  return { commission_percent, commission_value };
};

/**
 * Chamado AUTOMATICAMENTE no momento da criação do agendamento.
 */
export const registerBookingCommission = async (booking, service_price) => {
  const { commission_percent, commission_value } = calcCommission(service_price);

  // salvar transação
  await repo.createTransaction({
    schedule_id: booking.id,
    barbershop_id: booking.barbershop_id,
    service_price,
    commission_percent,
    commission_value,
    paid_online: false
  });

  // atualizar usage_metrics para isenção futura
  const month = booking.starts_at.substring(0, 7); // YYYY-MM

  const { data: usage } = await repo.countMonthlyBookings(
    booking.barbershop_id,
    month
  );

  const newCount = usage ? usage.appointments + 1 : 1;

  await repo.upsertUsage({
    barbershop_id: booking.barbershop_id,
    month,
    appointments: newCount,
    commission_rate: 5
  });

  return { commission_percent, commission_value };
};

/**
 * Gera invoice mensal completo (com ou sem isenção).
 */
export const generateMonthlyInvoice = async (barbershopId, month) => {
  const { data: usage } = await repo.countMonthlyBookings(barbershopId, month);
  const appointments = usage ? usage.appointments : 0;

  const isExempt = appointments >= 140;

  const { data: transactions } = await repo.listTransactionsForMonth(
    barbershopId,
    month
  );

  const totalCommission = transactions
    ? transactions.reduce((sum, t) => sum + Number(t.commission_value), 0)
    : 0;

  const finalValue = isExempt ? 0 : totalCommission;

  const invoice = await repo.createInvoice({
    barbershop_id: barbershopId,
    month,
    total_commission: finalValue,
    discount_applied: isExempt,
    discount_reason: isExempt ? "Isenção por 140+ agendamentos" : null,
    status: "pending"
  });

  return invoice.data;
};

/**
 * Exibe valor para o cliente no checkout.
 */
export const previewForClient = (service_price) => {
  const { commission_percent, commission_value } = calcCommission(service_price);
  const total = Number(service_price + commission_value).toFixed(2);

  return {
    service_price,
    app_fee: commission_value,
    percent: commission_percent,
    total_price: Number(total)
  };
};
