// src/modules/commission/cycle.js
import { generateMonthlyInvoice } from "./service.js";

const isLastWorkingDay = (date) => {
  const d = new Date(date);
  let day = d.getDate();
  let month = d.getMonth();
  let test = new Date(d);

  while (true) {
    test.setDate(day + 1);
    if (test.getMonth() !== month) break;
    if (test.getDay() !== 0 && test.getDay() !== 6) return false;
    day++;
  }

  return true;
};

export const runCommissionCycle = async (barbershopId) => {
  const now = new Date();
  const day = now.getDate();

  const isCycleDay =
    day === 15 || isLastWorkingDay(now);

  if (!isCycleDay) {
    return {
      executed: false,
      message: "Hoje não é dia de repasse"
    };
  }

  const month = now.toISOString().substring(0, 7);

  const invoice = await generateMonthlyInvoice(barbershopId, month);

  return {
    executed: true,
    invoice
  };
};
