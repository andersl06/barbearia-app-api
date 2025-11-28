// src/modules/bookings/service.js
import * as repo from "./repo.js";
import supabase from "../../core/db.js";

const CANCEL_WINDOW_MINUTES = process.env.CANCEL_WINDOW_MINUTES
  ? parseInt(process.env.CANCEL_WINDOW_MINUTES, 10)
  : 60; // padrão 60 minutos

// helpers de datas
const toDate = (iso) => new Date(iso);
const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);
const dateToIso = (date) => new Date(date).toISOString();

// converte dia string para número (0 dom, 1 seg..). Aceita 'monday'|'tuesday' etc ou número.
const dayOfWeekFromDate = (date) => {
  // retorna 0..6
  return new Date(date).getDay();
};

export const createBooking = async (clientUser, barbershopId, payload) => {
  // payload: { barber_id, service_id, starts_at }  (starts_at ISO string)
  const barberId = payload.barber_id;
  const serviceId = payload.service_id;
  const startsAtIso = payload.starts_at;

  if (!barberId || !serviceId || !startsAtIso) {
    throw new Error("barber_id, service_id e starts_at são obrigatórios");
  }

  // 1) validar que barbearia existe
  const { data: shop, error: shopErr } = await supabase
    .from("barbershops")
    .select("id, owner_id")
    .eq("id", barbershopId)
    .single();
  if (shopErr || !shop) throw new Error("Barbearia não encontrada");

  // 2) validar que barber pertence à barbearia e está ativo
  const { data: link, error: linkErr } = await supabase
    .from("barbershop_barbers")
    .select("is_active")
    .eq("barbershop_id", barbershopId)
    .eq("user_id", barberId)
    .single();
  if (linkErr || !link) throw new Error("Barbeiro não pertence à barbearia");
  if (!link.is_active) throw new Error("Barbeiro está inativo");

  // 3) buscar serviço e validar
  const { data: svc, error: svcErr } = await supabase
    .from("services")
    .select("id, price, duration_minutes, is_active, barbershop_id")
    .eq("id", serviceId)
    .single();
  if (svcErr || !svc) throw new Error("Serviço não encontrado");
  if (!svc.is_active) throw new Error("Serviço está inativo");
  if (svc.barbershop_id !== barbershopId) throw new Error("Serviço não pertence à barbearia");

  // 4) calcular end_time a partir de duration_minutes
  const startsAt = toDate(startsAtIso);
  if (isNaN(startsAt.getTime())) throw new Error("starts_at inválido");
  const endsAt = addMinutes(startsAt, svc.duration_minutes);

  // 5) validar disponibilidade semanal e exceções
  // busca availability do barber
  const { data: availabilityData, error: availErr } = await supabase
    .from("availability")
    .select("*")
    .eq("barber_id", barberId)
    .maybeSingle(); // pode não existir

  // se existir availability, checar
  if (availabilityData) {
    // exceptions: objeto JSON com datas bloqueadas por ISO date keys
    const exceptions = availabilityData.exceptions || {};
    const dateKey = startsAt.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    if (exceptions && exceptions[dateKey] && exceptions[dateKey].blocked) {
      throw new Error("Horário indisponível (exceção / bloqueio)");
    }

    // day_of_week field pode ser stored por linha ou por estrutura: assumimos tabela com várias linhas
    // Nota: se availability foi projetada com multiple rows per barber (day_of_week int), lidar abaixo:
    // buscar todas as linhas da tabela availability para o barber
    const { data: availRows } = await supabase
      .from("availability")
      .select("*")
      .eq("barber_id", barberId);

    // localizar um row que cobre o dia e horário
    const startsDay = startsAt.getDay(); // 0..6
    let ok = false;
    if (Array.isArray(availRows) && availRows.length > 0) {
      for (const r of availRows) {
        // r.day_of_week pode estar salvo como integer 0..6, ou string
        const rowDay = typeof r.day_of_week === "number" ? r.day_of_week : parseInt(r.day_of_week, 10);
        if (rowDay === startsDay) {
          // comparar horários — r.start_time e r.end_time armazenados como 'HH:MM' ou time
          const [rStartH, rStartM] = (r.start_time || "00:00").split(":").map(Number);
          const [rEndH, rEndM] = (r.end_time || "23:59").split(":").map(Number);
          const rowStart = new Date(startsAt);
          rowStart.setHours(rStartH, rStartM, 0, 0);
          const rowEnd = new Date(startsAt);
          rowEnd.setHours(rEndH, rEndM, 0, 0);

          // validar se o intervalo [startsAt, endsAt) está dentro de [rowStart, rowEnd)
          if (startsAt >= rowStart && endsAt <= rowEnd) {
            ok = true;
            break;
          }
        }
      }
      if (!ok) {
        throw new Error("Horario fora da disponibilidade semanal do barbeiro");
      }
    } else {
      // se não existir disponibilidade cadastrada, tratar como "sem restrição" ou bloquear? 
      // Optamos por permitir (flexível) — mas podemos mudar para bloquear.
      // Para segurança: se quiser bloquear por falta de disponibilidade, ative a validação.
      // aqui permitimos seguir.
    }
  }

  // 6) validar conflitos
  const { data: conflicts, error: conflictErr } = await repo.findConflicts(
    barberId,
    dateToIso(endsAt),
    dateToIso(startsAt)
  );
  // note: findConflicts uses lt/gt queries; supabase returns array in data or null
  if (conflictErr) throw conflictErr;
  if (Array.isArray(conflicts) && conflicts.length > 0) {
    throw new Error("Conflito de horário com outro agendamento");
  }

  // 7) criar booking
  const bookingPayload = {
    barbershop_id: barbershopId,
    barber_id: barberId,
    client_id: clientUser.id,
    service_id: serviceId,
    starts_at: dateToIso(startsAt),
    ends_at: dateToIso(endsAt),
    status: "pending",
    created_at: new Date()
  };

  const { data: booking, error: bookingErr } = await repo.createBooking(bookingPayload);
  if (bookingErr) throw bookingErr;

  // 8) opcional: criar billing_transactions entry / audit log (depois)
  return booking;
};

export const listBookingsForBarber = async (barbershopId, barberId) => {
  // lista agendamentos futuros do barbeiro naquela barbearia
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .eq("barber_id", barberId)
    .gte("starts_at", nowIso)
    .order("starts_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const listBookingsForBarbershop = async (barbershopId, opts = {}) => {
  const { from, to } = opts;
  return repo.findByBarbershop(barbershopId, { from, to });
};

export const cancelBooking = async (user, bookingId) => {
  // user can be client/barber/owner
  const { data: booking, error } = await repo.findById(bookingId);
  if (error || !booking) throw new Error("Agendamento não encontrado");

  // who can cancel?
  // - owner of barbershop can always cancel
  // - barber of booking can always cancel
  // - client can cancel only until CANCEL_WINDOW_MINUTES before starts_at
  const isOwner = user.role === "owner" && user.id === booking.barbershop_id ? false : false;
  // correct owner check: need to fetch barbershop.owner_id
  const { data: shop } = await supabase
    .from("barbershops")
    .select("owner_id")
    .eq("id", booking.barbershop_id)
    .single();

  const userIsOwner = shop && shop.owner_id === user.id;
  const userIsBarber = user.role === "barber" && user.id === booking.barber_id;
  const userIsClient = user.role === "client" && user.id === booking.client_id;

  if (!userIsOwner && !userIsBarber && !userIsClient) {
    throw new Error("Apenas cliente, barbeiro ou owner podem cancelar este agendamento");
  }

  if (userIsClient) {
    const now = new Date();
    const startsAt = new Date(booking.starts_at);
    const diffMin = (startsAt - now) / 60000;
    if (diffMin < CANCEL_WINDOW_MINUTES) {
      throw new Error(`Cancelamento indisponível: cliente só pode cancelar até ${CANCEL_WINDOW_MINUTES} minutos antes`);
    }
  }

  const { data: updated, error: updateErr } = await repo.updateStatus(bookingId, { status: "cancelled" });
  if (updateErr) throw updateErr;

  return updated;
};

export const updateStatus = async (user, bookingId, status) => {
  // used by barber/owner to confirm or mark as completed
  const { data: booking } = await repo.findById(bookingId);
  if (!booking) throw new Error("Agendamento não encontrado");

  // check permission: barber (if owns booking), owner (if barbershop owner)
  const { data: shop } = await supabase
    .from("barbershops")
    .select("owner_id")
    .eq("id", booking.barbershop_id)
    .single();

  const userIsOwner = shop && shop.owner_id === user.id;
  const userIsBarber = user.role === "barber" && user.id === booking.barber_id;

  if (!userIsOwner && !userIsBarber) {
    throw new Error("Apenas barbeiro ou owner podem alterar status");
  }

  const allowed = ["confirmed", "completed", "cancelled"];
  if (!allowed.includes(status)) throw new Error("Status inválido");

  const { data: updated, error } = await repo.updateStatus(bookingId, { status });
  if (error) throw error;
  return updated;
};
