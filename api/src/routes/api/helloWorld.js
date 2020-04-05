import { Router } from "express";
const router = Router();

// /api/hello-world
router.get("/hello-world", (_, res) => {
  res.json({ Hello: "world" });
});

export default router;
