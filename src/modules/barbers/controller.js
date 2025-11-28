// src/modules/barbers/controller.js
import * as service from "./service.js";

export const create = async (req, res, next) => {
  try {
    const ownerUser = req.user;
    const barbershopId = parseInt(req.params.barbershopId);
    const payload = req.body;

    const result = await service.createBarberInBarbershop(ownerUser, barbershopId, payload);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const barbershopId = parseInt(req.params.barbershopId);
    const list = await service.listBarbersOfBarbershop(barbershopId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const patch = async (req, res, next) => {
  try {
    const ownerUser = req.user;
    const barbershopId = parseInt(req.params.barbershopId);
    const userId = parseInt(req.params.userId);
    const updates = req.body;
    const result = await service.updateBarber(ownerUser.id, barbershopId, userId, updates);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const linkOwner = async (req, res, next) => {
  try {
    const ownerUser = req.user;
    const barbershopId = parseInt(req.params.barbershopId);
    const payload = req.body || {};
    const result = await service.linkOwnerAsBarber(ownerUser, barbershopId, payload);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
