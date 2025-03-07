import express from "express";
import { saveJob, getSavedJobs, removeSavedJob, isJobSaved } from "../controllers/User_Controller/savedJobController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";

const router = express.Router();

router.post("/saved-jobs/save", verifyTokens, saveJob);  // Save a job
router.get("/saved-jobs", verifyTokens, getSavedJobs);  // Get saved jobs for a user
router.delete("/saved-jobs/remove", verifyTokens, removeSavedJob);  // Remove saved job
router.get("/saved-jobs/check", verifyTokens, isJobSaved);  // Check if a job is saved

export default router;
