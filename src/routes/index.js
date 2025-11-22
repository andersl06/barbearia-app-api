import { Router } from "express";
import authRoutes from "./authRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import scheduleRoutes from "./scheduleRoutes.js";
import healthRoutes from "./healthRoutes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/health", healthRoutes);

export default router;
    