import express from "express";
import { createJobPost } from "../controllers/HR_Controllers/jobPostController.js"; 
import { getJobs } from "../controllers/HR_Controllers/getJobsController.js";

const router = express.Router();

router.post('/postjob', createJobPost);
router.get('/getjobs', getJobs);


export default router;