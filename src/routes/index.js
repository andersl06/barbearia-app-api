import { Router } from "express";
import authRoutes from "./authRoutes.js";
import barberRoutes from "./routes/barberRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/barbers", barberRoutes);
router.use("/schedule", scheduleRoutes);

export default router;
    