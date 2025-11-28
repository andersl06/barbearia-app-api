import * as service from "./service.js";

// CLIENTE
export const registerClient = async (req, res) => {
  try {
    const { name, email, phone, cpf, gender, password } = req.body;

    if (!name || !email || !phone || !cpf || !gender || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const result = await service.registerClient({
      name, email, phone, cpf, gender, password
    });

    return res.status(201).json(result);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// OWNER
export const registerOwner = async (req, res) => {
  try {
    const { name, email, phone, cpf, gender, password } = req.body;

    if (!name || !email || !phone || !cpf || !gender || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const result = await service.registerOwner({
      name, email, phone, cpf, gender, password
    });

    return res.status(201).json(result);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// BARBEIRO (owner cria)
export const createBarber = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(401).json({ message: "Owner não autenticado." });

    const { name, email, phone, cpf, gender } = req.body;

    if (!name || !email || !phone || !cpf || !gender) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const result = await service.createBarber({
      ownerId,
      name,
      email,
      phone,
      cpf,
      gender
    });

    return res.status(201).json(result);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await service.login({ email, password });
    return res.status(200).json(result);

  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

// CHANGE PASSWORD (primeiro acesso)
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Nova senha é obrigatória." });
    }

    const result = await service.changePassword({
      userId: req.user.id,
      newPassword
    });

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
