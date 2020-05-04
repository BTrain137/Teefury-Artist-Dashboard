import { Router } from "express";
const router = Router();
import adminSubmissions from "./submissions";
import adminEmail from "./email";
import adminCommissions from "./commissions"

router.use(adminEmail);
router.use(adminSubmissions);
router.use(adminCommissions);

export default router;
