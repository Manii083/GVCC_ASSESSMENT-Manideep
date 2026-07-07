const Document = require('../models/Document');
const documentService = require('../services/documentService');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

// @desc    Upload document
// @route   POST /api/documents
// @access  Private
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const fileType = path.extname(req.file.originalname).toLowerCase().substring(1);
    const filePath = req.file.path;

    // Extract text from document
    const extractedText = await documentService.extractText(filePath, fileType);

    // Create document record
    const document = await Document.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileType: fileType,
      filePath: filePath,
      extractedText: extractedText,
      fileSize: req.file.size
    });

    res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file && req.file.path) {
      await documentService.deleteFile(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user.id };

    if (search) {
      query.$text = { $search: search };
    }

    const documents = await Document.find(query)
      .sort({ uploadedAt: -1 })
      .select('-extractedText');

    res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from storage
    await documentService.deleteFile(document.filePath);

    // Delete document from database
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get document preview
// @route   GET /api/documents/:id/preview
// @access  Private
exports.getDocumentPreview = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Return first 500 characters as preview
    const preview = document.extractedText.slice(0, 500) + 
      (document.extractedText.length > 500 ? '...' : '');

    res.status(200).json({
      success: true,
      preview
    });
  } catch (error) {
    next(error);
  }
};