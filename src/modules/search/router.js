import { Router } from "express";
import { search } from "./service.js";

const router = Router();

router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const result = await search(q);
  res.json(result);
});

export default router;
