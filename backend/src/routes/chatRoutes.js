const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  askQuestion,
  getHistory,
  getConversation
} = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');

// Rate limiting for ask endpoint
const askLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 questions per hour
  message: {
    success: false,
    message: 'Too many questions. Please try again later.'
  }
});

// Validation rules
const askValidation = [
  body('documentId')
    .notEmpty().withMessage('Document ID is required')
    .isMongoId().withMessage('Invalid document ID'),
  body('question')
    .trim()
    .notEmpty().withMessage('Question is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Question must be between 1 and 1000 characters')
];

const conversationIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid conversation ID')
];

// Protected routes
router.use(protect);

// Ask question
router.post('/ask', askLimiter, askValidation, askQuestion);

// Get conversation history
router.get('/history', getHistory);

// Get specific conversation
router.get('/history/:id', conversationIdValidation, getConversation);

module.exports = router;