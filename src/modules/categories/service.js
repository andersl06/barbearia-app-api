// src/modules/categories/service.js
import * as repo from "./repo.js";
import supabase from "../../core/db.js";

export const createCategory = async (ownerId, barbershopId, data) => {
  // segurança: confirmar que owner é dono da barbearia
  const { data: shop, error: shopErr } = await supabase
    .from("barbershops")
    .select("id, owner_id")
    .eq("id", barbershopId)
    .single();

  if (shopErr || !shop) throw new Error("Barbearia não encontrada");
  if (shop.owner_id !== ownerId) throw new Error("Acesso negado");

  // validar se já existe categoria com mesmo nome
  const { data: existing } = await supabase
    .from("service_categories")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .eq("name", data.name.trim())
    .maybeSingle();

  if (existing) {
    throw new Error("Esta categoria já existe nesta barbearia");
  }

  const payload = {
    barbershop_id: barbershopId,
    name: data.name.trim()
  };

  const { data: category, error } = await repo.create(payload);
  if (error) throw error;

  return category;
};

export const listCategories = async (barbershopId) => {
  const { data, error } = await repo.list(barbershopId);
  if (error) throw error;
  return data;
};

export const updateCategory = async (ownerId, barbershopId, catId, updates) => {
  // Owner permission check
  const { data: shop } = await supabase
    .from("barbershops")
    .select("owner_id")
    .eq("id", barbershopId)
    .single();

  if (!shop) throw new Error("Barbearia não encontrada");
  if (shop.owner_id !== ownerId) throw new Error("Acesso negado");

  // category must belong to barbershop
  const { data: category } = await repo.findById(catId);
  if (!category) throw new Error("Categoria não encontrada");
  if (category.barbershop_id !== barbershopId) {
    throw new Error("Categoria não pertence a esta barbearia");
  }

  // nome único
  if (updates.name) {
    const { data: existing } = await supabase
      .from("service_categories")
      .select("*")
      .eq("barbershop_id", barbershopId)
      .eq("name", updates.name.trim())
      .maybeSingle();

    if (existing && existing.id !== catId) {
      throw new Error("Já existe uma categoria com este nome");
    }
  }

  const { data: updated, error } = await repo.update(catId, updates);
  if (error) throw error;

  return updated;
};
