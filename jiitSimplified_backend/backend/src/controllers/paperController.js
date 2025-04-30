const paperService = require('../services/paperService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User } = require('../models');

// Set up multer for file upload handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer uploader instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

exports.searchPapers = async (req, res) => {
  try {
    // Extract search parameters from query
    const { query, fromYear, toYear, terms } = req.query;
    
    // Validate required parameters
    if (!fromYear || !toYear || !terms) {
      return res.status(400).json({ 
        error: 'Missing required search parameters (fromYear, toYear, terms)' 
      });
    }
    
    const result = await paperService.searchPapers({ query, fromYear, toYear, terms });
    res.json(result);
  } catch (error) {
    console.error('Search papers error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Middleware for single file upload
exports.uploadMiddleware = upload.single('file');

exports.uploadPaper = async (req, res) => {
  try {
    const { subjectCode, year, term, title } = req.body;
    
    // Validate required fields
    if (!subjectCode || !year || !term) {
      return res.status(400).json({ 
        error: 'Missing required fields (subjectCode, year, term)' 
      });
    }
    
    // Check if file was uploaded successfully
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check session
    if (!req.session.user || !req.session.user.id) {
      console.log('Session data:', req.session); // Debug log
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Get the complete user object from database
    console.log('Looking up user with ID:', req.session.user.id); // Debug log
    const user = await User.findByPk(req.session.user.id);
    
    if (!user) {
      console.log('User not found for ID:', req.session.user.id); // Debug log
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('Found user:', { id: user.user_id, email: user.email }); // Debug log
    
    const paper = await paperService.uploadPaper(
      user,
      req.file,
      subjectCode,
      parseInt(year),
      term,
      title
    );
    
    res.status(201).json(paper);
  } catch (error) {
    console.error('Upload paper error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePaper = async (req, res) => {
  try {
    const paperId = req.params.id;
    if (!paperId) {
      return res.status(400).json({ error: 'Paper ID is required' });
    }
    
    const result = await paperService.deletePaper(req.user, paperId);
    res.json(result);
  } catch (error) {
    console.error('Delete paper error:', error);
    
    // Determine appropriate status code based on the error
    const statusCode = error.message === 'Unauthorized' ? 403 : 
                       error.message === 'Paper not found' ? 404 : 500;
    
    res.status(statusCode).json({ error: error.message });
  }
};
