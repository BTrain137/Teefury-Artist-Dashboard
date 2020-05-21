import cron from "node-cron";
import processOrders from "../libs/processOrdersFromShopify";
import { cleanDate, startAndEndTime } from "../utils/cleanData";

// At the 15 minute mark of every hour
cron.schedule("0 15 * * * *", () => {
  const now = new Date();
  const [startTime, endTime] = startAndEndTime(now);
  const date = cleanDate(now);
  console.log(`Cron: ${date}, ${startTime}, ${endTime}`);
  processOrders(date, startTime, endTime)
    .then(success => console.log(`CRON Success: -- ${date} ${startTime} ${endTime} :`, success))
    .catch((error) =>
      // TODO: post to slack
      console.log(`CRON ERROR: -- ${date} ${startTime} ${endTime} :`, error)
    );
});
