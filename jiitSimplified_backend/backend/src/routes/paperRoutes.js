const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Search for papers - no authentication required
router.get('/search', paperController.searchPapers);

// Upload a new paper - authentication required
router.post(
  '/upload', 
  isAuthenticated, 
  paperController.uploadMiddleware,
  paperController.uploadPaper
);

// Delete a paper - authentication required
router.delete('/:id', isAuthenticated, paperController.deletePaper);

module.exports = router;
