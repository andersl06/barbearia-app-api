// src/modules/availability/controller.js
import * as service from "./service.js";

export const set = async (req, res, next) => {
  try {
    const user = req.user;
    const barbershopId = parseInt(req.params.barbershopId);
    const barberId = parseInt(req.params.barberId);

    const result = await service.setAvailability(user, barbershopId, barberId, req.body);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const get = async (req, res, next) => {
  try {
    const barbershopId = parseInt(req.params.barbershopId);
    const barberId = parseInt(req.params.barberId);

    const availability = await service.getAvailability(barbershopId, barberId);

    res.json(availability);
  } catch (err) {
    next(err);
  }
};
