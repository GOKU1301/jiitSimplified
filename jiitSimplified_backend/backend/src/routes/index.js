const express = require('express');
const router = express.Router();
const path = require("path");
const {isAuthenticated} = require('../middlewares/authMiddleware');
const authRoutes = require('./authRoutes');
const paperRoutes = require('./paperRoutes');
const userRoutes = require('./userRoutes');


// 🏠 Home Route
router.get('/', (req, res) => {
  res.send(`📚 Welcome to the JIIT Simplified Portal API`);
});

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
 
});

router.use('/auth', authRoutes);
router.use('/papers', paperRoutes);
router.use('/user', userRoutes);

module.exports = router;
