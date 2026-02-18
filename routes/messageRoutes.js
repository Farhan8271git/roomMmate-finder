// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getMessages,
  getUnreadCount,
  deleteMessage
} = require('../controllers/messageController');
const { isAuthenticatedUser } = require('../middleware/auth');

// All routes are protected
router.post('/send', isAuthenticatedUser, sendMessage);
router.get('/conversations', isAuthenticatedUser, getConversations);
router.get('/conversation/:conversationId', isAuthenticatedUser, getMessages);
router.get('/unread-count', isAuthenticatedUser, getUnreadCount);
router.delete('/:messageId', isAuthenticatedUser, deleteMessage);

module.exports = router;