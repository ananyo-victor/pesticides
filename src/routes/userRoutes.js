import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { applyForJob } from "../controllers/applicationController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";

const router = express.Router();

// User profile routes
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.post('/profile/application/:jobId', verifyTokens, applyForJob);

export default router;