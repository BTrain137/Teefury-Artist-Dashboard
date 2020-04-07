import { Router } from "express";
const router = Router();
import helloWorld from './helloWorld.js';
import userRoutes from "./user";
import artistRoutes from "./artist";

// Test Route
router.use(helloWorld);

router.use(userRoutes);

router.use(artistRoutes);

export default router;
