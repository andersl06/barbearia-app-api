import * as service from "./service.js";

export const create = async (req, res, next) => {
  try {
    const review = await service.create(req.user.id, req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const listByBarbershop = async (req, res, next) => {
  try {
    const data = await service.listByBarbershop(req.params.barbershopId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const listByBarber = async (req, res, next) => {
  try {
    const data = await service.listByBarber(req.params.barberId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const reply = async (req, res, next) => {
  try {
    const updated = await service.barberReply(
      req.user.id,
      req.params.reviewId,
      req.body.reply
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
