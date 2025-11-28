// src/modules/users/controller.js
import * as service from "./service.js";

export const me = async (req, res, next) => {
  try {
    const user = await service.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await service.updateProfile(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
