import { barbershopsService } from "./service.js";

export const getMine = async (req, res) => {
  try {
    const shop = await barbershopsService.getMine(req.user.id);
    if (!shop) return res.status(404).json({ message: "Owner não possui barbearia" });

    return res.json(shop);

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const shop = await barbershopsService.getOne(req.params.id);
    return res.json(shop);

  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const shop = await barbershopsService.create(req.user.id, req.body);
    return res.status(201).json(shop);

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(400).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const shop = await barbershopsService.update(req.params.id, req.body);
    return res.json(shop);

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
