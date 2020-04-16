import { Router } from "express";
const router = Router();
import artistProfile from "./profile";
import artistSubmissions from "./submissions";

router.use(artistProfile);
router.use(artistSubmissions);

export default router;
