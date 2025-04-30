const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/subjects/suggestions', userController.getSubjectSuggestions);

module.exports = router;
