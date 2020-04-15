import { Router } from "express";
const router = Router();
import artistProfile from "./profile";

router.use(artistProfile);

export default router;
