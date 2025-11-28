import bcrypt from "bcryptjs";
import * as repo from "./repo.js";
import { generateToken, generateTempToken } from "../../shared/token.js";
import { env } from "../../config/env.js";

// CLIENTE
export async function registerClient(data) {
  const hashed = await bcrypt.hash(data.password, env.HASH_ROUNDS);

  const user = await repo.createUser({
    name: data.name,
    email: data.email,
    phone: data.phone,
    cpf: data.cpf,
    gender: data.gender,
    role: "client",
    password_hash: hashed,
  });

  return { message: "Cliente registrado.", user };
}

// OWNER
export async function registerOwner(data) {
  const hashed = await bcrypt.hash(data.password, env.HASH_ROUNDS);

  const user = await repo.createUser({
    name: data.name,
    email: data.email,
    phone: data.phone,
    cpf: data.cpf,
    gender: data.gender,
    role: "owner",
    password_hash: hashed,
  });

  return { message: "Owner registrado.", user };
}

// BARBER (senha temporária)
export async function createBarber({ ownerId, name, email, phone, cpf, gender }) {
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashed = await bcrypt.hash(tempPassword, env.HASH_ROUNDS);

  const user = await repo.createUser({
    name,
    email,
    phone,
    cpf,
    gender,
    role: "barber",
    password_hash: hashed,
    must_change_password: true,
  });

  return {
    message: "Barbeiro criado.",
    user,
    tempPassword,
  };
}

// LOGIN
export async function login({ email, password }) {
  const user = await repo.findUserByEmail(email);
  if (!user) throw new Error("Email não encontrado.");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Senha incorreta.");

  if (user.must_change_password) {
    return {
      token: generateTempToken(user),
      must_change_password: true,
    };
  }

  return {
    token: generateToken(user),
    user,
  };
}

// Troca de senha
export async function changePassword({ userId, newPassword }) {
  const hashed = await bcrypt.hash(newPassword, env.HASH_ROUNDS);

  await repo.updateUser(userId, {
    password_hash: hashed,
    must_change_password: false,
  });

  return { message: "Senha alterada com sucesso." };
}
