// src/modules/barbershops/controller.js
import * as service from "./service.js";

export const create = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const shop = await service.createBarbershop(ownerId, req.body);
    res.status(201).json(shop);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const shopId = parseInt(req.params.id);

    const shop = await service.updateBarbershop(ownerId, shopId, req.body);
    res.json(shop);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const shop = await service.getBarbershopById(req.params.id);
    res.json(shop);
  } catch (err) {
    next(err);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const shop = await service.getBySlug(req.params.slug);
    res.json(shop);
  } catch (err) {
    next(err);
  }
};
