// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  logoutUser
} = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', isAuthenticatedUser, getUserProfile);
router.put('/profile/update', isAuthenticatedUser, updateProfile);
router.get('/logout', isAuthenticatedUser, logoutUser);

module.exports = router;