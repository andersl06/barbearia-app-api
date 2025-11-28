// src/modules/services/controller.js
import * as service from "./service.js";

export const create = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const barbershopId = parseInt(req.params.barbershopId);
    const result = await service.createService(ownerId, barbershopId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const serviceId = parseInt(req.params.serviceId);
    const result = await service.updateService(ownerId, serviceId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const toggleStatus = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const serviceId = parseInt(req.params.serviceId);
    const active = req.body.is_active;

    const result = await service.toggleStatus(ownerId, serviceId, active);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const barbershopId = parseInt(req.params.barbershopId);
    const services = await service.listServices(barbershopId);
    res.json(services);
  } catch (err) {
    next(err);
  }
};
