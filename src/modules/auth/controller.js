import * as service from "./service.js";

export const registerClient = async (req, res) => {
  try {
    const { name, email, password, phone, cpf, gender } = req.body;

    if (!name || !email || !password || !phone || !cpf || !gender) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const result = await service.registerClient({ name, email, password, phone, cpf, gender });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const registerOwner = async (req, res) => {
  try {
    const { name, email, password, phone, cpf, gender } = req.body;

    if (!name || !email || !password || !phone || !cpf || !gender) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const result = await service.registerOwner({ name, email, password, phone, cpf, gender });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const createBarber = async (req, res) => {
  try {
    const { name, email, phone, cpf, gender } = req.body;

    if (!name || !email || !phone || !cpf || !gender) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // barber não recebe senha — geramos temporária
    const result = await service.createBarber({ ownerId: req.user.id, name, email, phone, cpf, gender });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
