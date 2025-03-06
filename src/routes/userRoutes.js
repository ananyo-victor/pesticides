import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/User_Controller/userController.js";
import { applyForJob } from "../controllers/User_Controller/applicationController.js";
import { verifyTokens } from "../middlewares/verifyTokens.js";
import multer from 'multer';
import { AppliedJobs } from "../controllers/User_Controller/appliedjobsController.js";

const router = express.Router();
//multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'profilePic') {
        cb(null, 'uploads/profile/'); // Directory where profile images will be stored
      } else if (file.fieldname === 'resume') {
        cb(null, 'uploads/resumes/'); // Directory where resumes will be stored
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
  });
  
  const upload = multer({ storage: storage }).fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]);

// User profile routes
router.get('/profile/:id', getUserProfile);
router.put('/upProfile/:id', upload, updateUserProfile);
router.post('/profile/application/:jobId', verifyTokens, applyForJob);
router.get('/profile/appliedjobs/myjob',verifyTokens,AppliedJobs);

export default router;