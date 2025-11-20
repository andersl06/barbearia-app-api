import { Router } from "express";


const router = Router();

const barbershops = [
    {
    id: 1,
    name: "Barbearia do Zé",
    address: "Rua A, 123 - Centro",
    avgPrice: 35,
    avgTimeMinutes: 40,
    }
]

router.get("/", (req, res) => {
  return res.json(barbershops);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const shop = barbershops.find((item) => item.id === id);

  if (!shop) {
    return res.status(404).json({ message: "Barbearia não encontrada" });
  }

  return res.json(shop);
});

export default router;


