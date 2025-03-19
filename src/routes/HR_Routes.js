import express from "express";
import { createJobPost, getJobs, getJobById } from "../controllers/HR_Controllers/JobController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";
import { getApp } from "../controllers/User_Controller/applicationController.js";
import hrDashboard from "../service/hrServices/hrDash.js";
import { DeleteJobPost } from "../controllers/HR_Controllers/DeleteJobController.js";
import { getHrProfile, updateHrProfile } from "../controllers/HR_Controllers/HrController.js";
import { upload } from "../middlewares/multer/multerFile.js";

const router = express.Router();

router.get('/profile/', verifyTokens, getHrProfile);
router.put('/upProfile/',verifyTokens, upload, updateHrProfile);
router.post("/postjob",verifyTokens, createJobPost);
router.get("/getjobs", verifyTokens, getJobs);
router.get("/getjobsById/:Id", verifyTokens, getJobById);
router.get("/applications/:jobId", getApp); // Fetch applications for a specific job
router.get('/hr-dashboard',verifyTokens, hrDashboard );
router.put('/deleteJobPost/:Id',verifyTokens,DeleteJobPost)

export default router;
