import supabase from "../../core/db.js";
import { hashPassword, signToken } from "../../core/security.js";
import { AppError } from "../../core/errors.js";

// --------------------------------------------------
// CLIENTE
// --------------------------------------------------
export const registerClient = async ({ name, email, password, phone, cpf, gender }) => {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .or(`email.eq.${email},cpf.eq.${cpf}`)
    .maybeSingle();

  if (existing) throw new AppError("Email ou CPF já cadastrados", 400);

  const password_hash = await hashPassword(password);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      phone,
      cpf,
      gender,
      password_hash,
      role: "client"
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  const token = signToken({ id: user.id, role: user.role });

  return { user, token };
};


// --------------------------------------------------
// OWNER
// --------------------------------------------------
export const registerOwner = async ({ name, email, password, phone, cpf, gender }) => {
  const { data: exists } = await supabase
    .from("users")
    .select("id")
    .or(`email.eq.${email},cpf.eq.${cpf}`)
    .maybeSingle();

  if (exists) throw new AppError("Email ou CPF já cadastrados", 400);

  const password_hash = await hashPassword(password);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      phone,
      cpf,
      gender,
      password_hash,
      role: "owner"
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  const token = signToken({ id: user.id, role: user.role });

  return { user, token };
};


// --------------------------------------------------
// BARBER (criado pelo owner)
// --------------------------------------------------
export const createBarber = async ({ ownerId, name, email, phone, cpf, gender }) => {
  // regra: dono só cria barbeiro da própria barbearia (validamos depois)

  const tempPassword = Math.random().toString(36).slice(-8);
  const password_hash = await hashPassword(tempPassword);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name,
      email,
      phone,
      cpf,
      gender,
      password_hash,
      role: "barber",
      must_change_password: true
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);

  return {
    message: "Barber criado com sucesso. Ele deve trocar a senha no primeiro login.",
    user,
    tempPassword
  };
};
