// src/modules/barbers/service.js
import * as repo from "./repo.js";
import * as authService from "../auth/service.js"; // ideal: usar função para criar usuário
import supabase from "../../core/db.js";

/**
 * Cria (ou reutiliza) um usuário barbeiro e vincula à barbearia:
 * - Se existir um user com esse email: apenas vincula
 * - Se não existir: cria user via auth service (createBarberByOwner) ou diretamente
 */
export const createBarberInBarbershop = async (ownerUser, barbershopId, payload) => {
  // ownerUser: { id, role } from req.user
  // payload: { name, email, phone, cpf, nickname, bio, avatar_url }

  // 1) valida se owner é dono daquela barbearia (ownership check)
  const { data: barbershop, error: shopErr } = await supabase
    .from("barbershops")
    .select("*")
    .eq("id", barbershopId)
    .single();

  if (shopErr || !barbershop) throw new Error("Barbearia não encontrada");
  if (barbershop.owner_id !== ownerUser.id) throw new Error("Acesso negado: não é owner desta barbearia");

  // 2) checa se existe user com email
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", payload.email)
    .single();

  let user;
  if (existingUser) {
    // se existe, garantimos role barber (se não for, não sobrescrevemos automaticamente)
    user = existingUser;
  } else {
    // cria usuário barbeiro via auth service (para aplicar must_change_password etc)
    if (authService && typeof authService.createBarberByOwner === "function") {
      const { barber, tempPassword } = await authService.createBarberByOwner({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        cpf: payload.cpf
      });
      user = barber;
      // tempPassword pode ser retornado para notificação por e-mail (futuro)
    } else {
      // fallback direto no users: criar com senha temporária simples (melhor usar auth)
      const tempPassword = Math.random().toString(36).slice(-8);
      const { data: createdUser, error: createErr } = await supabase
        .from("users")
        .insert({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          cpf: payload.cpf,
          role: "barber",
          password_hash: tempPassword, // obs: idealmente hash — aqui é fallback
          must_change_password: true
        })
        .select()
        .single();
      if (createErr) throw createErr;
      user = createdUser;
    }
  }

  // 3) cria registro na tabela barbers (perfil) se não existir
  const { data: existingProfile } = await repo.findProfileByUserId(user.id);
  let profile;
  if (!existingProfile || !existingProfile.data) {
    const { data: createdProfile, error: profErr } = await repo.createProfile({
      user_id: user.id,
      barbershop_id: barbershopId,
      nickname: payload.nickname || null,
      bio: payload.bio || null,
      avatar_url: payload.avatar_url || null
    });
    if (profErr) throw profErr;
    profile = createdProfile;
  } else {
    profile = existingProfile;
  }

  // 4) vincula em barbershop_barbers (se não estiver vinculado)
  const { data: link, error: linkErr } = await repo.findLink(barbershopId, user.id);
  if (!link) {
    const { data: createdLink, error: createLinkErr } = await repo.linkBarberToBarbershop({
      barbershop_id: barbershopId,
      user_id: user.id,
      is_owner: false,
      is_active: true
    });
    if (createLinkErr) throw createLinkErr;
  }

  return { user, profile };
};

export const listBarbersOfBarbershop = async (barbershopId) => {
  const { data, error } = await supabase
    .from("barbershop_barbers")
    .select(`id, is_owner, is_active, created_at, users:user_id (id, name, email, avatar_url),
             barbers:barber_id (id, nickname, bio, avatar_url)`)
    .eq("barbershop_id", barbershopId);

  if (error) throw error;
  return data;
};

export const updateBarber = async (ownerUserId, barbershopId, userId, updates) => {
  // Apenas owner da barbearia pode atualizar ativação do barbeiro ou link
  const { data: shop } = await supabase.from("barbershops").select("*").eq("id", barbershopId).single();
  if (!shop) throw new Error("Barbearia não encontrada");
  if (shop.owner_id !== ownerUserId) throw new Error("Acesso negado");

  // atualiza link is_active ou is_owner
  const { data: link } = await repo.findLink(barbershopId, userId);
  if (!link) throw new Error("Vínculo não encontrado");

  // only allow to update limited fields
  const allowed = {};
  if (typeof updates.is_active === "boolean") allowed.is_active = updates.is_active;
  if (typeof updates.is_owner === "boolean") allowed.is_owner = updates.is_owner;

  const { data: updatedLink, error } = await repo.updateLink(link.id, allowed);
  if (error) throw error;

  // update barber profile fields (nickname/bio/avatar) if present
  const { data: profile } = await repo.findProfileByUserId(userId);
  if (profile) {
    const profileUpdates = {};
    if (updates.nickname) profileUpdates.nickname = updates.nickname;
    if (updates.bio) profileUpdates.bio = updates.bio;
    if (updates.avatar_url) profileUpdates.avatar_url = updates.avatar_url;

    if (Object.keys(profileUpdates).length > 0) {
      await repo.updateProfile(profile.id, profileUpdates);
    }
  }

  return { updatedLink };
};

/**
 * Owner vira barbeiro (link-owner)
 * Cria link com is_owner true e cria profile caso necessário
 */
export const linkOwnerAsBarber = async (ownerUser, barbershopId, payload = {}) => {
  // ownerUser is req.user
  // validate ownership
  const { data: shop } = await supabase.from("barbershops").select("*").eq("id", barbershopId).single();
  if (!shop) throw new Error("Barbearia não encontrada");
  if (shop.owner_id !== ownerUser.id) throw new Error("Acesso negado");

  // create profile if not exists
  const { data: profile } = await repo.findProfileByUserId(ownerUser.id);
  if (!profile) {
    await repo.createProfile({
      user_id: ownerUser.id,
      barbershop_id: barbershopId,
      nickname: payload.nickname || null,
      bio: payload.bio || null
    });
  }

  // link or update link to is_owner true
  const { data: link } = await repo.findLink(barbershopId, ownerUser.id);
  if (!link) {
    const { data: createdLink } = await repo.linkBarberToBarbershop({
      barbershop_id: barbershopId,
      user_id: ownerUser.id,
      is_owner: true,
      is_active: true
    });
    return createdLink;
  } else {
    const { data: updated } = await repo.updateLink(link.id, { is_owner: true, is_active: true });
    return updated;
  }
};
