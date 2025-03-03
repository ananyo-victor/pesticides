import express from "express";
import { getUserProfile, updateUserProfile  } from "../controllers/userController.js";
import  {applyForJob}  from  "../controllers/applicationController.js";

const router = express.Router();

// User profile routes
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.get('/profile/application', applyForJob)

export default router;