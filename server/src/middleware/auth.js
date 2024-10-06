const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Auth middleware called');
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      console.log('No authorization header found');
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decodedToken);

    req.userId = decodedToken.id;
    console.log('User ID set:', req.userId);

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Authentication failed' });
  }
};