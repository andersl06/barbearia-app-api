import supabase from "../../core/db.js";

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
}

export async function createUser(userData) {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateUser(id, fields) {
  const { error } = await supabase
    .from("users")
    .update(fields)
    .eq("id", id);

  if (error) throw new Error(error.message);
}
