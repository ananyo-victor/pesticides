import express from "express";
import { createJobPost, getJobs, getJobById } from "../controllers/HR_Controllers/JobController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";
import { getApp } from "../controllers/User_Controller/applicationController.js";
import hrDashboard from "../service/hrServices/hrDash.js";
import { DeleteJobPost } from "../controllers/HR_Controllers/DeleteJobController.js";

const router = express.Router();

router.post("/postjob",verifyTokens, createJobPost);
router.get("/getjobs", getJobs);
router.get("/getjobsById/:Id", getJobById);
router.get("/applications/:jobId", getApp); // Fetch applications for a specific job
router.get('/hr-dashboard', hrDashboard );
router.put('/deleteJobPost/:Id',verifyTokens,DeleteJobPost)

export default router;