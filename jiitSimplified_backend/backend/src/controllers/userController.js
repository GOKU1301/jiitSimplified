const subjectService = require('../services/subjectService');

exports.getSubjectSuggestions = async (req, res) => {
  const { query } = req.query;
  const suggestions = await subjectService.getSuggestions(query);
  res.json(suggestions);
};
