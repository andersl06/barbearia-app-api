import supabase from "../../core/db.js";

export const search = async (query) => {
  const q = `%${query}%`;

  const [barbershops, services, users] = await Promise.all([
    supabase
      .from("barbershops")
      .select("*")
      .ilike("name", q),

    supabase
      .from("services")
      .select("*, barbershops(name, city, state)")
      .ilike("name", q),

    supabase
      .from("users")
      .select("id, name, avatar_url")
      .eq("role", "barber")
      .ilike("name", q)
  ]);

  return {
    barbershops: barbershops.data,
    services: services.data,
    barbers: users.data
  };
};
