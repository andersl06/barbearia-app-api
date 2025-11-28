import { Router } from "express";

import authRouter from "../modules/auth/router.js";
import usersRouter from "../modules/users/router.js";
import barbershopsRouter from "../modules/barbershops/router.js";
import barbersRouter from "../modules/barbers/router.js";
import categoriesRouter from "../modules/categories/router.js";
import servicesRouter from "../modules/services/router.js";
import availabilityRouter from "../modules/availability/router.js";
import bookingsRouter from "../modules/bookings/router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/barbershops", barbershopsRouter);
router.use("/barbers", barbersRouter);
router.use("/categories", categoriesRouter);
router.use("/services", servicesRouter);
router.use("/availability", availabilityRouter);
router.use("/bookings", bookingsRouter);

export default router;
