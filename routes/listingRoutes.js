// backend/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
  markInterest
} = require('../controllers/listingController');
const { isAuthenticatedUser } = require('../middleware/auth');

// Public routes
router.get('/', getAllListings);

// Protected routes (MUST come before /:id route)
router.post('/create', isAuthenticatedUser, createListing);
router.get('/my-listings', isAuthenticatedUser, getMyListings);

// Dynamic ID routes (MUST be at the end)
router.get('/:id', getListingById);
router.put('/:id', isAuthenticatedUser, updateListing);
router.delete('/:id', isAuthenticatedUser, deleteListing);
router.post('/:id/interest', isAuthenticatedUser, markInterest);

module.exports = router;