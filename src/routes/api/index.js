import { Router } from "express";
const router = Router();
import helloWorld from './helloWorld.js';

// Test Route
router.use(helloWorld);

export default router;
