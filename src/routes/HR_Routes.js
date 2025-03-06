import express from "express";
import { createJobPost } from "../controllers/HR_Controllers/jobPostController.js"; 
import { getJobs, getJobsById } from "../controllers/HR_Controllers/getJobsController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";

const router = express.Router();

router.post('/postjob',verifyTokens, createJobPost);
router.get('/getjobs', getJobs);
router.get('/getjobsById/:Id', getJobsById);


export default router;