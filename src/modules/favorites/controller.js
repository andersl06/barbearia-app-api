import * as service from "./service.js";

export const favorite = async (req, res, next) => {
  try {
    const result = await service.favorite(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const unfavorite = async (req, res, next) => {
  try {
    await service.unfavorite(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const data = await service.list(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
