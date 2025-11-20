import { Router } from "express";


const router = Router ();

router.get("/", (req, res) => {
  const now = new Date();

  return res.json({
    status: "ok",
    message: "Barbearia API funcionando",
    timestamp: now.toISOString(),
  });
});

export default router;

