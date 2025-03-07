import express from "express";
import { createJobPost } from "../controllers/HR_Controllers/jobPostController.js";
import {
  getJobs,
  getJobsById 
} from "../controllers/HR_Controllers/getJobsController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";
import { getApp } from "../controllers/User_Controller/applicationController.js";

const router = express.Router();

router.post("/postjob",verifyTokens, createJobPost);
router.get("/getjobs", getJobs);
router.get("/getjobsById/:Id", getJobsById);
router.get("/applications/:jobId", getApp); // Fetch applications for a specific job


export default router;
