// src/config/env.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Garante que o .env seja carregado da raiz, não de src/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, "../../.env");

// Carrega o .env
dotenv.config({ path: rootPath });

// Exporta tudo organizado
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || 3000,

  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",

  HASH_ROUNDS: Number(process.env.HASH_ROUNDS || 10),
};
