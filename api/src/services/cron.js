import cron from "node-cron";
import processOrders from "../libs/processOrdersFromShopify";
import { startAndEndTime } from "../utils/cleanData";

const { NODE_ENV } = process.env;

if (NODE_ENV !== "stage") {
  // At the 15 minute mark of every hour
  cron.schedule("0 15 * * * *", async () => {
    const now = new Date();
    const { startDate, startHour, endDate, endHour } = startAndEndTime(now);

    const output = `${startDate} ${startHour} ${endDate} ${endHour}`;
    try {
      await processOrders({ startDate, startHour, endDate, endHour });
    } catch (error) {
      console.log(`CRON ERROR: -- ${output} :`, error);
    }
  });
}
