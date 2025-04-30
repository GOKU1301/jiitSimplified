const { Subject } = require('../models');

exports.getSuggestions = async (query) => {
  return Subject.findAll({
    where: {
      name: { like: `%${query}%` },
    },
    limit: 10,
  });
};
