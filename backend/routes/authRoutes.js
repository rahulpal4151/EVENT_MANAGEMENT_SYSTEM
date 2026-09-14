import express from 'express';
import { registerUser, loginUser, logoutUser, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

// Signup Route: POST /api/auth/register
router.post('/register', registerUser);

// Verify OTP TRY
router.post('/verify-otp', verifyOTP);

// Login Route: POST /api/auth/login
router.post('/login', loginUser);

// Logout Route: POST /api/auth/logout
router.post('/logout', logoutUser);


export default router;