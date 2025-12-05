// src/modules/barbershops/service.js
import { barbershopsRepo } from "./repo.js";

export const barbershopsService = {
  getMine: async (ownerId) => {
    const shop = await barbershopsRepo.findByOwnerId(ownerId);

    if (!shop) return null;
    return shop;
  },

  getOne: async (id) => {
    const shop = await barbershopsRepo.findById(id);

    if (!shop) throw new Error("Barbearia não encontrada");
    return shop;
  },

  create: async (ownerId, payload) => {
    const newData = {
      ...payload,
      owner_id: ownerId,
    };

    const shop = await barbershopsRepo.create(newData);
    return shop;
  },

  update: async (id, payload) => {
    const shop = await barbershopsRepo.update(id, payload);

    if (!shop) throw new Error("Erro ao atualizar barbearia");
    return shop;
  }
};
