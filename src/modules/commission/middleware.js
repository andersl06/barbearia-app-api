import { checkSuspension } from "./policy.js";

export async function enforceBarbershopActive(req, res, next) {
  const { barbershopId } = req.params;

  const status = await checkSuspension(barbershopId);

  if (status.suspended) {
    return res.status(403).json({
      message: "Barbearia suspensa por falta de pagamento.",
      reason: status.reason,
    });
  }

  next();
}
