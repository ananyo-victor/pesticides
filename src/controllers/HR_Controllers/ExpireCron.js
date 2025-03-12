import cron from "node-cron";
import { deleteExpiredJobService } from "../../service/hrServices/deleteJobService.js";


// Runs every day at midnight (00:00) to mark expired jobs as inactive
cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled job: Marking expired job posts as inactive...");
    await deleteExpiredJobService();
});
