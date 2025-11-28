import * as repo from "./repo.js";

export const favorite = (clientId, barbershopId) =>
  repo.add({ client_id: clientId, barbershop_id: barbershopId });

export const unfavorite = repo.remove;

export const list = (clientId) => repo.list(clientId);
