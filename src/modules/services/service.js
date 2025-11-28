// src/modules/services/service.js
import * as repo from "./repo.js";
import supabase from "../../core/db.js";

export const createService = async (ownerId, barbershopId, data) => {
  // 1. verificar se barbearia pertence ao owner
  const { data: shop } = await supabase
    .from("barbershops")
    .select("owner_id")
    .eq("id", barbershopId)
    .single();

  if (!shop) throw new Error("Barbearia não encontrada");
  if (shop.owner_id !== ownerId) throw new Error("Acesso negado");

  // 2. validar categoria (se existir)
  if (data.category_id) {
    const { data: category } = await supabase
      .from("service_categories")
      .select("id, barbershop_id")
      .eq("id", data.category_id)
      .single();

    if (!category) throw new Error("Categoria não encontrada");
    if (category.barbershop_id !== barbershopId) {
      throw new Error("Categoria não pertence à barbearia");
    }
  }

  // 3. criar serviço
  const payload = {
    barbershop_id: barbershopId,
    name: data.name.trim(),
    description: data.description || null,
    price: data.price,
    duration_minutes: data.duration_minutes,
    category_id: data.category_id || null,
    is_active: true
  };

  const { data: service, error } = await repo.create(payload);
  if (error) throw error;

  return service;
};

export const updateService = async (ownerId, serviceId, updates) => {
  // buscar serviço
  const { data: service } = await repo.findById(serviceId);
  if (!service) throw new Error("Serviço não encontrado");

  // validar owner
  const { data: shop } = await supabase
    .from("barbershops")
    .select("owner_id")
    .eq("id", service.barbershop_id)
    .single();

  if (!shop) throw new Error("Barbearia não encontrada");
  if (shop.owner_id !== ownerId) throw new Error("Acesso negado");

  // validar categoria se enviada
  if (updates.category_id) {
    const { data: category } = await supabase
      .from("service_categories")
      .select("id, barbershop_id")
      .eq("id", updates.category_id)
      .single();

    if (!category) throw new Error("Categoria inválida");
    if (category.barbershop_id !== service.barbershop_id) {
      throw new Error("Categoria não pertence à barbearia");
    }
  }

  const { data: updated, error } = await repo.update(serviceId, updates);
  if (error) throw error;

  return updated;
};

export const toggleStatus = async (ownerId, serviceId, active) => {
  const { data: service } = await repo.findById(serviceId);
  if (!service) throw new Error("Serviço não encontrado");

  const { data: shop } = await supabase
    .from("barbershops")
    .select("owner_id")
    .eq("id", service.barbershop_id)
    .single();

  if (shop.owner_id !== ownerId) throw new Error("Acesso negado");

  const { data: updated, error } = await repo.update(serviceId, {
    is_active: active
  });
  if (error) throw error;

  return updated;
};

export const listServices = async (barbershopId) => {
  const { data, error } = await repo.listByBarbershop(barbershopId);
  if (error) throw error;
  return data;
};
