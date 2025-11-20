import { Router } from "express";
import authRoutes from "./authRoutes.js";
import barberRoutes from "./barberRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/barbers", barberRoutes);
router.use("/schedule", scheduleRoutes);
router.use("/health", healthRoutes);

export default router;
    