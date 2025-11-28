// src/modules/bookings/controller.js
import * as service from "./service.js";

export const create = async (req, res, next) => {
  try {
    const clientUser = req.user;
    const barbershopId = parseInt(req.params.barbershopId);
    const booking = await service.createBooking(clientUser, barbershopId, req.body);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const listByBarber = async (req, res, next) => {
  try {
    const barbershopId = parseInt(req.params.barbershopId);
    const barberId = parseInt(req.params.barberId);
    const list = await service.listBookingsForBarber(barbershopId, barberId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const listByBarbershop = async (req, res, next) => {
  try {
    const barbershopId = parseInt(req.params.barbershopId);
    const { from, to } = req.query; // optional ISO filters
    const list = await service.listBookingsForBarbershop(barbershopId, { from, to });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const user = req.user;
    const bookingId = parseInt(req.params.bookingId);
    const result = await service.cancelBooking(user, bookingId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const user = req.user;
    const bookingId = parseInt(req.params.bookingId);
    const { status } = req.body;
    const result = await service.updateStatus(user, bookingId, status);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
