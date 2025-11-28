// src/modules/audit/controller.js
import supabase from "../../core/db.js";

export const list = async (req, res) => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return res.status(500).json({ error });
  res.json(data);
};
