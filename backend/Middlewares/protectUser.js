// middlewares/protectUser.js
exports.protectUser = (req, res, next) => {
  try {
    const userSession = req.session.user;
    
console.log("User Session:", req.session);
console.log("User session at protectUser", userSession);

    
    if (!userSession) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    if (userSession.role !== 'user') {
      return res.status(403).json({ message: 'Admins cannot access user endpoints' });
    }

    req.user = userSession;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error at protect user' });
  }
};


