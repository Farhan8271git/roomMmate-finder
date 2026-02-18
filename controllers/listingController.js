// backend/controllers/listingController.js
const Listing = require('../models/Listing');

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    // Check if user exists in request
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated. Please login again.'
      });
    }

    // Add user ID to listing data
    const listingData = {
      ...req.body,
      user: req.user.id
    };
    
    const listing = await Listing.create(listingData);

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create Listing Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all listings with filters
exports.getAllListings = async (req, res) => {
  try {
    const {
      city,
      type,
      roomType,
      minRent,
      maxRent,
      gender,
      smoking,
      pets,
      vegetarian,
      wifi,
      ac,
      parking,
      furnished,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { status: 'Active' };

    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (type) filter.type = type;
    if (roomType) filter.roomType = roomType;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }
    if (gender) filter['preferences.gender'] = gender;
    if (smoking === 'true') filter['preferences.smoking'] = true;
    if (pets === 'true') filter['preferences.pets'] = true;
    if (vegetarian === 'true') filter['preferences.vegetarian'] = true;
    if (wifi === 'true') filter['amenities.wifi'] = true;
    if (ac === 'true') filter['amenities.ac'] = true;
    if (parking === 'true') filter['amenities.parking'] = true;
    if (furnished === 'true') filter['amenities.furnished'] = true;

    // Pagination
    const skip = (page - 1) * limit;

    const listings = await Listing.find(filter)
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('user', 'name email phone avatar age gender occupation bio');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's own listings
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update listing
exports.updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user owns this listing
    if (listing.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing'
      });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user owns this listing
    if (listing.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark interest in a listing
exports.markInterest = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if already interested
    const alreadyInterested = listing.interested.includes(req.user.id);

    if (alreadyInterested) {
      // Remove interest
      listing.interested = listing.interested.filter(
        id => id.toString() !== req.user.id
      );
      await listing.save();

      return res.status(200).json({
        success: true,
        message: 'Interest removed',
        interested: false
      });
    } else {
      // Add interest
      listing.interested.push(req.user.id);
      await listing.save();

      return res.status(200).json({
        success: true,
        message: 'Interest marked successfully',
        interested: true
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};