const Document = require('../models/Document');
const Conversation = require('../models/Conversation');
const geminiService = require('../services/geminiService');
const { validationResult } = require('express-validator');

// @desc    Ask a question about a document
// @route   POST /api/chat/ask
// @access  Private
exports.askQuestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { documentId, question } = req.body;

    // Find document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user.id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Get answer from AI
    const answer = await geminiService.askQuestion(document.extractedText, question);

    // Save conversation
    const conversation = await Conversation.create({
      userId: req.user.id,
      documentId: document._id,
      question,
      answer
    });

    res.status(200).json({
      success: true,
      conversation: {
        id: conversation._id,
        question: conversation.question,
        answer: conversation.answer,
        document: {
          id: document._id,
          name: document.fileName
        },
        createdAt: conversation.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation history
// @route   GET /api/chat/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };

    if (search) {
      query.$text = { $search: search };
    }

    const conversations = await Conversation.find(query)
      .populate('documentId', 'fileName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Conversation.countDocuments(query);

    res.status(200).json({
      success: true,
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific conversation
// @route   GET /api/chat/history/:id
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('documentId', 'fileName');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    next(error);
  }
};