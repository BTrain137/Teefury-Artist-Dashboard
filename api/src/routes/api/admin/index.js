import { Router } from "express";
const router = Router();
import adminSubmissions from "./submissions";
import adminEmail from "./email";
import adminCommissions from "./commissions"
import adminOrder from "./orders";

router.use(adminEmail);
router.use(adminSubmissions);
router.use(adminCommissions);
router.use(adminOrder);

export default router;
