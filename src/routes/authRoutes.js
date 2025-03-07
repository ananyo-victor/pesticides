import express from "express";
import { signUpUser, signUpHR, signIn } from "../controllers/Auth_Controller/authController.js";

const router = express.Router();

router.post('/signup/user', signUpUser);
router.post('/signup/hr', signUpHR);
router.post('/signin', signIn);

export default router;