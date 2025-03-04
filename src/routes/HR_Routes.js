import express from "express";
import { createJobPost } from "../controllers/HR_Controllers/jobPostController.js"; 

const router = express.Router();

router.post('/postjob', createJobPost);


export default router;