import pool from "../config/db.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, phone, cpf, gender, role } = req.body;

  console.log("📩 BODY RECEBIDO NO REGISTER:", req.body);

  const userRole = role === "client" ? "client" : "barber";

  try {
    console.log("1) Validando campos obrigatórios...");
    if (!name || !email || !password || !cpf || !phone || !gender || !role) {
      return res.status(400).json({
        message: "Nome, e-mail, senha, CPF, telefone, gênero e tipo são obrigatórios",
      });
    }

    console.log("2) Verificando se CPF já existe...");
    const existing = await pool.query(
      "SELECT id FROM users WHERE cpf = $1",
      [cpf]
    );
    console.log("   existing.rows:", existing.rows);

    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Já existe usuário com esse CPF" });
    }

    console.log("3) Gerando hash da senha...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log("   passwordHash gerado (início):", passwordHash.slice(0, 15) + "...");

    console.log("4) Inserindo usuário no banco...");
    const result = await pool.query(
      `INSERT INTO users (name, email, cpf, password_hash, phone, role, gender)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, cpf, phone, role, gender, created_at`,
      [name, email, cpf, passwordHash, phone || null, userRole, gender || null]
    );
    console.log("   result.rows:", result.rows);

    const user = result.rows[0];

    console.log("5) Gerando token JWT...");
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Register finalizado com sucesso para user id:", user.id);

    return res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error("❌ ERRO NO REGISTER COMPLETO:");
    console.error(error);              // objeto inteiro
    console.error("message:", error?.message);
    console.error("stack:", error?.stack);

    return res.status(500).json({
      message: "Erro ao registrar usuário",
      error: error?.message,
    });
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
      "SELECT id, name, email, password_hash, role, gender FROM users WHERE email = $1",
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
        gender: user.gender,
      },
    });

  } catch (error) {
    console.error("Erro no login:", error.message);
    return res.status(500).json({ message: "Erro ao fazer login" });
  }
}