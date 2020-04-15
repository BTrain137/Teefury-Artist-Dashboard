import { Router } from "express";
const router = Router();
import userRoutes from "./user";
import artistRoutes from "./artist";

router.use(userRoutes);

router.use(artistRoutes);

export default router;
