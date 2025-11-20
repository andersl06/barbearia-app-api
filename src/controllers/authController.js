import pool from "../config/db.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const {name, email, cpf, password, phone } = req.body;

     try {
    // 1. validar campos básicos
    if (!name || !email || !password || !cpf || !phone) {
      return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios" });
    }

    // 2. verificar se já existe usuário com esse e-mail
    const existing = await pool.query(
      "SELECT id FROM users WHERE cpf = $1",
      [cpf]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Já existe usuário com esse e-mail" });
    }

    // 3. gerar hash da senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. inserir no banco
    const result = await pool.query(
    `INSERT INTO users (name, email, cpf, password_hash, phone, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, email, cpf, phone, role, created_at`,
    [name, email, cpf, passwordHash, phone || null, "barber"]
    );

    const user = result.rows[0];

    const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
    );

    return res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error("Erro no register:", error.message);
    return res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. validar campos
    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    // 2. buscar usuário pelo e-mail
    const result = await pool.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const user = result.rows[0];

    // 3. comparar senha
    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // 4. gerar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. retornar dados
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error.message);
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
}