import jwt from 'jsonwebtoken';

export const refreshTokenMiddleware = (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token requis' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Générer un nouvel access token
    const newAccessToken = jwt.sign(
      { 
        userId: decoded.userId,
        role: decoded.role,
        subscription_status: decoded.subscription_status 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '24h' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Refresh token invalide' });
  }
};
