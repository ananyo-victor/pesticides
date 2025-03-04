import express from "express";
import { getUserProfile, updateUserProfile  } from "../controllers/userController.js";
import  {applyForJob}  from  "../controllers/applicationController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";

const router = express.Router();

// User profile routes
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);
router.post('/profile/application', applyForJob , verifyTokens ,(req, res) => {
    console.log(req.body);
    res.status(200).json({ message: 'Data received' });
  });
  

export default router;