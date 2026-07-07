const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  getDocumentPreview
} = require('../controllers/documentController');

// Validation rules
const documentIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid document ID')
];

// Protected routes
router.use(protect);

// Document upload
router.post('/', upload.single('file'), uploadDocument);

// Get all documents (with search)
router.get('/', getDocuments);

// Get document preview
router.get('/:id/preview', documentIdValidation, getDocumentPreview);

// Get single document
router.get('/:id', documentIdValidation, getDocument);

// Delete document
router.delete('/:id', documentIdValidation, deleteDocument);

module.exports = router;