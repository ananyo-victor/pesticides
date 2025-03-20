import express from "express";
import { signUpUser, signUpHR, signIn } from "../controllers/Auth_Controller/authController.js";
import { forgotPasswordC, resetPasswordC } from "../controllers/Auth_Controller/passwordController.js";

const router = express.Router();

router.post('/signup/user', signUpUser);
router.post('/signup/hr', signUpHR);
router.post('/signin', signIn);
router.post("/forgot-password", forgotPasswordC);
router.post("/reset-password/:token", resetPasswordC);

export default router;