import express from 'express';
import { signupValidation, loginValidation } from "../Middlewares/AuthValidation.js";
import ensureAuthenticated from "../Middlewares/Auth.js";
import { login, signup, getMe, googleLogin, logout } from "../controller/AuthController.js";
import { loginLimiter, signupLimiter } from "../Middlewares/RateLimit.js";

const router = express.Router();

// The limiter runs first, so a blocked request never reaches the database
router.post('/signup', signupLimiter, signupValidation, signup);
router.post('/login', loginLimiter, loginValidation, login);
router.post('/google', loginLimiter, googleLogin);
router.post('/logout', logout);
router.get('/me', ensureAuthenticated, getMe);

export default router;
