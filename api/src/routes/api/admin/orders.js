import express from "express";
import processOrders from "../../../libs/processOrdersFromShopify";
import { cleanDate, startAndEndTime } from "../../../utils/cleanData";

const router = express.Router();

// /api/admin/order-pull?inputDate=2020-05-21&start=13&end=14
router.get("/order-pull", async (req, res, next) => {
  const { inputDate, start, end } = req.params;

  const now = inputDate ? new Date(inputDate) : new Date();
  const [startTime, endTime] = inputDate ? [start, end] : startAndEndTime(now);

  const date = cleanDate(now);

  try {
    await processOrders(date, startTime, endTime);
    res.status(200).send(`CRON SUCCESS: -- ${date} ${startTime} ${endTime}`);
  } catch (error) {
    console.log(`CRON ERROR: -- ${date} ${startTime} ${endTime} :`, error);
    next(error);
  }
});

export default router;
