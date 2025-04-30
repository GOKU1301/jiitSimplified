const { User } = require('../models');

exports.googleCallback = async (req, res) => {
  if (!req.user) {
    return res.redirect('http://localhost:3001/login?error=auth_failed');
  }

  try {
    // Find or create user in database
    const [user, created] = await User.findOrCreate({
      where: { oauth_id: req.user.id },
      defaults: {
        name: req.user.displayName,
        email: req.user.emails[0].value,
        role_id: 1,
        oauth_id: req.user.id
      }
    });

    // Create a session with user data
    req.session.user = {
      id: user.user_id, 
      email: user.email,
      name: user.name,
      picture: req.user.photos[0]?.value,
      role_id: user.role_id
    };

    // Log session data for debugging
    console.log('Session user data:', req.session.user);

    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect('http://localhost:3001/login?error=session');
      }
      res.redirect('http://localhost:3001/dashboard');
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.redirect('http://localhost:3001/login?error=db_error');
  }
};

exports.logout = (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('connect.sid');
      res.redirect('http://localhost:3001/login');
    });
  });
};

exports.getCurrentUser = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.session.user);
};