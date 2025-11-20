// src/config/db.js
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config(); // garante que o .env foi lido aqui

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, //necessário para o supabase
  },
});

// logs pra saber se conectou
pool.on("connect", () => {
  console.log("Conectado ao Supabase com sucesso");
});

pool.on("error", (err) => {
  console.error("Sem conexão com o Supabase:", err.message);
});

export default pool;
