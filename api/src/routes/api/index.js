import { Router } from "express";
const router = Router();
import userRoutes from "./user";
import artistRoutes from "./artist";

router.use("/user", userRoutes);
router.use("/artist", artistRoutes);

export default router;
