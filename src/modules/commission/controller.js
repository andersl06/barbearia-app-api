// dentro de commission/controller.js
import { runCommissionCycle } from "./cycle.js";

export const runCycle = async (req, res, next) => {
  try {
    const barbershopId = parseInt(req.params.barbershopId);
    const response = await runCommissionCycle(barbershopId);
    res.json(response);
  } catch (err) {
    next(err);
  }
};
