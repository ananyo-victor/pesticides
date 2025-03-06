import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { applyForJob } from "../controllers/applicationController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";
import { AppliedJobs } from "../controllers/User_Controller/appliedjobsController.js";

const router = express.Router();

// User profile routes
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.post('/profile/application/:jobId', verifyTokens, applyForJob);
router.get('/profile/appliedjobs/myjob',verifyTokens,AppliedJobs);

export default router;