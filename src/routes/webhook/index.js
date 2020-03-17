import { Router } from "express";
const router = Router();
import helloWorld from './helloWorld.js';

// Test Route
// /webhook/orders
router.use("/hello-world", helloWorld);

export default router;
