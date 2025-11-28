// src/modules/users/service.js
import * as repo from "./repo.js";

export const getProfile = async (userId) => {
  const { data, error } = await repo.getById(userId);
  if (error || !data) throw new Error("Usuário não encontrado");
  return data;
};

export const updateProfile = async (userId, updates) => {
  // regras simples:
  // dono só atualiza o próprio perfil
  // barber não muda role
  if (updates.role) delete updates.role;

  const { data, error } = await repo.update(userId, updates);
  if (error) throw error;

  return data;
};

// usado internamente pelos módulos
export const findUser = async (id) => {
  const { data, error } = await repo.getById(id);
  if (error) throw error;
  return data;
};
