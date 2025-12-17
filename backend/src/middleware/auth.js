// ⚙️ backend/src/middleware/auth.js
const auth = (req, res, next) => {
  // This is a basic auth middleware - you should replace it with your actual authentication logic
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Here you would verify the JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
