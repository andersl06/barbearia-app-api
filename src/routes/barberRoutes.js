import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Lista de barbarias funcionando");
});

export default router;


