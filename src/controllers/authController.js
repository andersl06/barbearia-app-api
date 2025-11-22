  import pool from "../config/db.js";
  import bcrypt from "bcryptjs"; 
  import jwt from "jsonwebtoken";

  const JWT_EXPIRES_IN = "1d";

  // Registrar novo usuário
  export const register = async (req, res) => {
    const { name, email, password, phone, cpf, gender, role, slug, barbershop_id } = req.body;

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
      

      console.log("4) Inserindo usuário no banco...");
      const result = await pool.query(
        `INSERT INTO users (name, email, cpf, password_hash, phone, role, gender)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, cpf, phone, role, gender, created_at`,
        [name, email, cpf, passwordHash, phone || null, userRole, gender || null]
      );


      const user = result.rows[0];

      console.log("5) Gerando token JWT...");
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      console.log("Register finalizado com sucesso para user id:", user.id);

      return res.status(201).json({
        token,
        user,
      });
    } catch (error) {
      console.error("ERRO NO REGISTER COMPLETO:");
      console.error(error);              // objeto inteiro
      console.error("message:", error?.message);
      console.error("stack:", error?.stack);

      return res.status(500).json({
        message: "Erro ao registrar usuário",
        error: error?.message,
      });
    }
  };
  // Login de usuário
  export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1) validação básica
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "E-mail e senha são obrigatórios" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2) busca usuário no banco
    const result = await pool.query(
      `SELECT 
         id,
         name,
         email,
         role,
         cpf,
         status,
         password_hash
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    // 3) se não achou usuário
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const user = result.rows[0];

    // 4) verifica status, se quiser travar conta inativa/bloqueada
    if (user.status && user.status !== "active") {
      return res
        .status(403)
        .json({ message: "Conta inativa. Reative para continuar." });
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      console.log("[LOGIN] Senha inválida para user id:", user.id);
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // 6) gera token
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // remove hash antes de devolver pro front
    delete user.password_hash;

    return res.json({ token, user });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro ao efetuar login" });
  }
};