const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const documentService = require('../services/DocumentService');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// GET /documents - Get all documents (PUBLIC)
router.get('/', async (req, res, next) => {
  try {
    const documents = await documentService.getDocuments();

    return res.status(200).json({
      status: 'success',
      data: { documents },
    });
  } catch (error) {
    next(error);
  }
});

// GET /documents/:id - Get document by ID (PUBLIC)
router.get('/:id', async (req, res, next) => {
  try {
    const document = await documentService.getDocumentById(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: document,
    });
  } catch (error) {
    next(error);
  }
});

// POST /documents - Upload document (PROTECTED, multipart/form-data)
router.post('/', authMiddleware, upload.single('document'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'failed',
        message: 'No document file uploaded',
      });
    }

    const id = await documentService.addDocument({
      userId: req.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    return res.status(201).json({
      status: 'success',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /documents/:id - Delete document (PROTECTED)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await documentService.deleteDocument(req.params.id);

    return res.status(200).json({
      status: 'success',
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
