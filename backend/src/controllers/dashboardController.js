const Document = require('../models/Document');
const Conversation = require('../models/Conversation');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get total documents
    const totalDocuments = await Document.countDocuments({ userId });

    // Get total questions
    const totalQuestions = await Conversation.countDocuments({ userId });

    // Get recent uploads
    const recentUploads = await Document.find({ userId })
      .select('fileName fileType fileSize uploadedAt')
      .sort({ uploadedAt: -1 })
      .limit(5);

    // Get recent conversations
    const recentConversations = await Conversation.find({ userId })
      .populate('documentId', 'fileName')
      .select('question answer createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalDocuments,
        totalQuestions,
        recentUploads,
        recentConversations
      }
    });
  } catch (error) {
    next(error);
  }
};