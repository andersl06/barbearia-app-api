// src/modules/commission/middleware.js
import { checkSuspension } from "./policy.js";

export const enforceBarbershopActive = async (req, res, next) => {
  const barbershopId = parseInt(req.params.barbershopId);

  const status = await checkSuspension(barbershopId);

  if (status.suspended) {
    return res.status(403).json({
      message: "Barbearia suspensa por falta de pagamento",
      reason: status.reason
    });
  }

  next();
};
