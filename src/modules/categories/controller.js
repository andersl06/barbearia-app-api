// src/modules/categories/controller.js
import * as service from "./service.js";

export const create = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const barbershopId = parseInt(req.params.barbershopId);

    const category = await service.createCategory(ownerId, barbershopId, req.body);

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const barbershopId = parseInt(req.params.barbershopId);

    const categories = await service.listCategories(barbershopId);

    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const barbershopId = parseInt(req.params.barbershopId);
    const categoryId = parseInt(req.params.categoryId);

    const category = await service.updateCategory(
      ownerId,
      barbershopId,
      categoryId,
      req.body
    );

    res.json(category);
  } catch (err) {
    next(err);
  }
};
