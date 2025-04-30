// middlewares/authMiddleware.js

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ message: 'You must be logged in to access this resource' });
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
}

module.exports = {
  isAuthenticated,
  isAdmin,
};
