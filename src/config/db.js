import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// logs opcionais, só pra você ver que conectou
pool.on("connect", () => {
  console.log("✅ Conectado ao PostgreSQL com sucesso");
});

pool.on("error", (err) => {
  console.error("❌ Erro na conexão com o PostgreSQL:", err.message);
});

export default pool;
