import { Router } from "express";
const router = Router();
import helloWorld from './helloWorld.js';
import passportRoutes from "./passport";
import artistRoutes from "./artist";

// Test Route
router.use(helloWorld);

router.use(passportRoutes);

router.use(artistRoutes);

export default router;
