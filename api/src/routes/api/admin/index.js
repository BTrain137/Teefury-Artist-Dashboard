import { Router } from "express";
const router = Router();
import adminSubmissions from "./submissions";
import adminEmail from "./email";

router.use(adminEmail);
router.use(adminSubmissions);

export default router;
