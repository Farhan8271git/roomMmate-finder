// backend/models/Listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please enter listing title'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter description'],
    maxLength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please select listing type'],
    enum: ['Room Available', 'Looking for Room', 'Looking for Roommate']
  },
  roomType: {
    type: String,
    required: [true, 'Please select room type'],
    enum: ['Private', 'Shared', 'Studio', 'Apartment']
  },
  rent: {
    type: Number,
    required: [true, 'Please enter rent amount'],
    min: [0, 'Rent cannot be negative']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please enter address']
    },
    city: {
      type: String,
      required: [true, 'Please enter city']
    },
    state: {
      type: String,
      required: [true, 'Please enter state']
    },
    pincode: {
      type: String,
      required: [true, 'Please enter pincode'],
      match: [/^[0-9]{6}$/, 'Please enter valid 6-digit pincode']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  amenities: {
    wifi: {
      type: Boolean,
      default: false
    },
    ac: {
      type: Boolean,
      default: false
    },
    parking: {
      type: Boolean,
      default: false
    },
    kitchen: {
      type: Boolean,
      default: false
    },
    laundry: {
      type: Boolean,
      default: false
    },
    furnished: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any'
    },
    smoking: {
      type: Boolean,
      default: false
    },
    pets: {
      type: Boolean,
      default: false
    },
    vegetarian: {
      type: Boolean,
      default: false
    }
  },
  availableFrom: {
    type: Date,
    required: [true, 'Please enter available from date']
  },
  images: [
    {
      type: String
    }
  ],
  contactPhone: {
    type: String,
    required: [true, 'Please enter contact number'],
    match: [/^[0-9]{10}$/, 'Please enter valid 10-digit phone number']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Closed'],
    default: 'Active'
  },
  views: {
    type: Number,
    default: 0
  },
  interested: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search optimization
listingSchema.index({ 'location.city': 1, rent: 1, type: 1 });
listingSchema.index({ user: 1 });

module.exports = mongoose.model('Listing', listingSchema);