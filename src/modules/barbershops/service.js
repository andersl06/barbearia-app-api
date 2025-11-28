// src/modules/barbershops/service.js
import * as repo from "./repo.js";

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const createBarbershop = async (ownerId, data) => {
  // FUTURO: permitir várias unidades por owner
  // MVP: apenas 1 barbearia por owner
  // (se quiser, posso ativar isso depois)
  
  const slug = generateSlug(data.name);

  const payload = {
    owner_id: ownerId,
    name: data.name,
    slug,
    description: data.description || null,
    phone: data.phone || null,
    address: data.address || null,
    cnpj: data.cnpj || null,
    cpf: data.cpf || null,
    city: data.city || null,
    state: data.state || null,
    zipcode: data.zipcode || null,
    address_number: data.address_number || null,
    address_complement: data.address_complement || null,
    neighborhood: data.neighborhood || null,
    facilities: data.facilities || [],
    payment_methods: data.payment_methods || [],
    opening_hours: data.opening_hours || {},
    social_links: data.social_links || {},
    cover_url: data.cover_url || null,
    logo_url: data.logo_url || null,
  };

  const { data: shop, error } = await repo.create(payload);
  if (error) throw error;

  return shop;
};

export const updateBarbershop = async (ownerId, shopId, updates) => {
  // impedir que alguém atualize a barbearia de outro owner
  const { data: shop, error } = await repo.findById(shopId);
  if (error || !shop) throw new Error("Barbearia não encontrada");

  if (shop.owner_id !== ownerId) {
    throw new Error("Acesso negado à barbearia");
  }

  if (updates.name) {
    updates.slug = generateSlug(updates.name);
  }

  const { data: updated, error: updateError } = await repo.update(shopId, updates);
  if (updateError) throw updateError;

  return updated;
};

export const getBarbershopById = async (id) => {
  const { data, error } = await repo.findById(id);
  if (error || !data) throw new Error("Barbearia não encontrada");
  return data;
};

export const getBySlug = async (slug) => {
  const { data, error } = await repo.findBySlug(slug);
  if (error || !data) throw new Error("Barbearia não encontrada");
  return data;
};
