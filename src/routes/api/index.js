import { Router } from "express";
const router = Router();
import helloWorld from './helloWorld.js';
import passportRoutes from "./passport";

// Test Route
router.use(helloWorld);

router.use(passportRoutes);

export default router;
