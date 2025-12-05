import supabase from "../core/db.js";

// Verificar se o usuário é proprietário da barbearia
export const isOwnerOfBarbershop = async (req, res, next) => {
  try {
    const userId = Number(req.user?.id);
    const barbershopId = Number(
      req.params.barbershopId || req.body.barbershopId
    );

    if (!userId || !barbershopId) {
      return res.status(400).json({
        message: "ownerId ou barbershopId ausente",
      });
    }

    const { data, error } = await supabase
      .from("barbershop_barbers")
      .select("id")
      .eq("barbershop_id", barbershopId)
      .eq("user_id", userId)
      .eq("is_owner", true)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ message: "Erro interno de autorização" });
    }

    if (!data) {
      return res.status(403).json({
        message: "Ação permitida somente para o proprietário",
      });
    }

    next();
  } catch (error) {
    console.error("isOwnerOfBarbershop error:", error.message);
    return res.status(500).json({ message: "Erro interno de autorização" });
  }
};


// Verificar se o usuário é barbeiro da barbearia
export const isBarberOfBarbershop = async (req, res, next) => {
  try {
    const userId = Number(req.user?.id);
    const barbershopId = Number(
      req.params.barbershopId ||
        req.body.barbershopId ||
        req.query.barbershopId
    );

    if (!userId || !barbershopId) {
      return res.status(400).json({
        message: "barberId ou barbershopId ausente",
      });
    }

    const { data, error } = await supabase
      .from("barbershop_barbers")
      .select("id")
      .eq("barbershop_id", barbershopId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ message: "Erro interno de autorização" });
    }

    if (!data) {
      return res.status(403).json({
        message: "Ação permitida somente para barbeiros vinculados",
      });
    }

    next();
  } catch (error) {
    console.error("isBarberOfBarbershop error:", error.message);
    return res.status(500).json({ message: "Erro interno de autorização" });
  }
};
