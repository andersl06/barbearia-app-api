import * as service from "./service.js";

export async function preview(req, res) {
  const price = Number(req.query.service_price);
  const result = service.calculateCommission(price);
  res.json(result);
}

export async function generate(req, res) {
  const { barbershopId } = req.params;
  const { month } = req.query;

  const invoice = await service.generateInvoice(barbershopId, month);

  res.json(invoice);
}

export async function getInvoice(req, res) {
  const { barbershopId } = req.params;
  const { month } = req.query;

  const { data } = await service.getInvoice(barbershopId, month);
  res.json(data || { total_commission: 0, status: "no_invoice" });
}
