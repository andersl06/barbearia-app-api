import supabase from "../../core/db.js";

export const barbershopsRepo = {
  // Buscar barbearia do owner
  findByOwnerId: async (ownerId) => {
    const { data, error } = await supabase
      .from("barbershops")
      .select("*")
      .eq("owner_id", ownerId)
      .maybeSingle(); // evita erro quando não existe

    return { data, error };
  },

  // Buscar por ID
  findById: async (id) => {
    const { data, error } = await supabase
      .from("barbershops")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    return { data, error };
  },

  // Criar barbearia
  create: async (payload) => {
    const { data, error } = await supabase
      .from("barbershops")
      .insert(payload)
      .select()
      .single();

    return { data, error };
  },

  // Atualizar barbearia
  update: async (id, payload) => {
    const { data, error } = await supabase
      .from("barbershops")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  }
};
