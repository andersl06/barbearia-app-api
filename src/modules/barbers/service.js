import supabase from "../../core/db.js";
import bcrypt from "bcryptjs";
import { env } from "../../config/env.js";
import * as authRepo from "../../modules/auth/repo.js";
import { generateTempToken } from "../../shared/token.js";

/**
 * ============================================================
 * OWNER → VIRA BARBEIRO DA PRÓPRIA BARBEARIA
 * ============================================================
 */
export async function linkOwnerAsBarber(barbershopId, ownerUserId, payload = {}) {
  //
  // 1 — Criar vínculo na tabela barbershop_barbers
  //
  const { data: link, error: linkErr } = await supabase
    .from("barbershop_barbers")
    .upsert(
      {
        barbershop_id: barbershopId,
        user_id: ownerUserId,
        is_owner: true,
        is_active: true,
      },
      { onConflict: "barbershop_id,user_id" }
    )
    .select()
    .single();

  if (linkErr) {
    console.error("Erro ao criar vínculo:", linkErr);
    throw new Error(linkErr.message);
  }

  //
  // 2 — Verificar se já existe entry na tabela barbers
  //
  const { data: existingBarber } = await supabase
    .from("barbers")
    .select("*")
    .eq("user_id", ownerUserId)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  //
  // 3 — Preparar dados do perfil
  //
  const profileData = {
    bio: payload?.profile?.bio || null,
    nickname: null,
    avatar_url: null,
  };

  let barber;

  //
  // 4 — Criar ou atualizar registro na tabela barbers
  //
  if (!existingBarber) {
    // Criar
    const { data: newBarber, error: barberErr } = await supabase
      .from("barbers")
      .insert({
        user_id: ownerUserId,
        barbershop_id: barbershopId,
        bio: profileData.bio,
        nickname: profileData.nickname,
        avatar_url: profileData.avatar_url,
      })
      .select()
      .single();

    if (barberErr) {
      console.error("Erro ao criar barbeiro:", barberErr);
      throw new Error(barberErr.message);
    }

    barber = newBarber;
  } else {
    // Atualizar
    const { data: updatedBarber, error: updateErr } = await supabase
      .from("barbers")
      .update({
        bio: profileData.bio,
      })
      .eq("id", existingBarber.id)
      .select()
      .single();

    if (updateErr) throw new Error(updateErr.message);

    barber = updatedBarber;
  }

  //
  // 5 — Retornar dados consistentes
  //
  return {
    message: "Owner agora vinculado como barbeiro.",
    link,
    barber,
  };
}

/**
 * ============================================================
 * CRIAR BARBEIRO (NOVO USER + BARBERS)
 * ============================================================
 */
  export async function create(barbershopId, payload) { // Renomeado para 'create' para corresponder ao controller
    //
    // 1 — Gerar hash da senha fornecida pelo Owner
    //
    const passwordHash = await bcrypt.hash(payload.user.password, env.HASH_ROUNDS);

    //
    // 2 — Criar usuário com senha segura
    //
    const userToInsert = {
      name: payload.user.name,
      email: payload.user.email,
      phone: payload.user.phone,
      cpf: payload.user.cpf,
      gender: payload.user.gender || "n/a",
      password_hash: passwordHash,
      role: "barber",
      must_change_password: true, // ⚠️ OBRIGATÓRIO PARA PRIMEIRO ACESSO
    };
    
    // Usando a função createUser (do repo de Auth)
    const user = await authRepo.createUser(userToInsert); 
    if (!user) throw new Error("Erro ao criar usuário."); 

    //
    // 3 — Criar entry na tabela barbers (Perfil)
    //
    const { data: barber, error: barberErr } = await supabase
      .from("barbers")
      .insert({
        user_id: user.id,
        barbershop_id: barbershopId,
        bio: payload.profile?.bio || null,
        nickname: null,
        avatar_url: null,
      })
      .select()
      .single();

    if (barberErr) throw new Error(barberErr.message);

    //
    // 4 — Criar vínculo barbershop_barbers
    //
    const { error: linkErr } = await supabase
      .from("barbershop_barbers")
      .insert({
        barbershop_id: barbershopId,
        user_id: user.id,
        is_owner: false,
        is_active: true,
      });

    if (linkErr) throw new Error(linkErr.message);

    //
    // 5 — Gerar token TEMPORÁRIO de primeiro acesso
    //
    const tempToken = generateTempToken(user); 
    
    return {
      message: "Barbeiro criado com sucesso.",
      user,
      barber,
      barbershop_id: barbershopId,
      temp_access_token: tempToken, // 🔥 o front usa para redirecionar
    };
  }

/**
 * ============================================================
 * LISTAR TODOS OS BARBEIROS DA BARBEARIA
 * ============================================================
 */
export async function listBarbers(barbershopId) {
  const { data, error } = await supabase
    .from("barbers")
    .select(`
      *,
      users:user_id (
        id, name, email, phone, cpf, gender, avatar_url
      )
    `)
    .eq("barbershop_id", barbershopId);

  if (error) throw new Error(error.message);

  return data || [];
}

/**
 * ============================================================
 * ATUALIZAR BARBEIRO (nickname, bio, avatar)
 * ============================================================
 */
export async function updateBarber(barbershopId, userId, updates) {
  const { data: barber, error } = await supabase
    .from("barbers")
    .update({
      bio: updates.profile?.bio ?? undefined,
      nickname: updates.profile?.nickname ?? undefined,
      avatar_url: updates.profile?.avatar_url ?? undefined,
    })
    .eq("user_id", userId)
    .eq("barbershop_id", barbershopId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return barber;
}
