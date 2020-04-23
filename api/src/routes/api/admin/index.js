import { Router } from "express";
const router = Router();
import artistSubmissions from "./submissions";

router.use(artistSubmissions);

export default router;
