import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_change_in_production');
    
    // Add user from payload
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token, access denied' });
  }
};

// Middleware to check if user is an NGO
const isNGO = (req, res, next) => {
  if (req.user && req.user.role === 'ngo') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. NGO role required.' });
  }
};

// Middleware to check if user is a regular user
const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. User role required.' });
  }
};

export { auth, isNGO, isUser };