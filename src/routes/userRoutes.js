import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/User_Controller/userController.js";
import { getJobs, getJobById } from "../controllers/User_Controller/jobController.js";
import { applyForJob, isJobApplied } from "../controllers/User_Controller/applicationController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";
import { upload } from "../middlewares/multer/multerFile.js";
import { AppliedJobs } from "../controllers/User_Controller/appliedjobsController.js";

const router = express.Router();

// User profile routes
router.get('/profile/', verifyTokens, getUserProfile);
router.put('/upProfile/',verifyTokens, upload, updateUserProfile);
router.get("/getjobs", getJobs);
router.get("/getjobsById/:Id", verifyTokens, getJobById);
router.post('/profile/application/:jobId', verifyTokens, upload, applyForJob);
router.get('/profile/appliedjobs/myjob', verifyTokens, AppliedJobs);
router.get('/profile/appliedjobs/check', verifyTokens, isJobApplied);
 
export default router; 