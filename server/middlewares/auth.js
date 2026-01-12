import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../config/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      return res.status(401).json({ message: 'No access token provided' });
    }

    const decoded = verifyAccessToken(accessToken);

    if (decoded) {
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      return next();
    }

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const refreshDecoded = verifyRefreshToken(refreshToken);
    if (!refreshDecoded) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(refreshDecoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Refresh token mismatch' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    req.userId = user._id;
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    next();
  };
};
