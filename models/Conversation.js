// backend/models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  lastMessage: {
    type: String,
    trim: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only 2 participants
conversationSchema.path('participants').validate(function(value) {
  return value.length === 2;
}, 'A conversation must have exactly 2 participants');

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);