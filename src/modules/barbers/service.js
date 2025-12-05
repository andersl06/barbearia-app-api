import * as repo from "./repo.js";
import * as usersRepo from "../users/repo.js";

export const create = async (barbershopId, payload) => {
  const { user, profile } = payload;

  const newUser = await usersRepo.createBarberUser(user);
  const link = await repo.linkBarber(barbershopId, newUser.id);

  const profileData = await repo.createProfile({
    ...profile,
    user_id: newUser.id,
    barbershop_id: barbershopId,
  });

  return { user: newUser, profile: profileData };
};

export const linkOwner = async (barbershopId, ownerId) => {
  return repo.linkBarber(barbershopId, ownerId, true);
};

export const list = async (barbershopId) => {
  return repo.list(barbershopId);
};
