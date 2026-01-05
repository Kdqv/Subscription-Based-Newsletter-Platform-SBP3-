import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (userId, role, subscriptionStatus = 'free') => {
  const payload = {
    userId,
    role,
    subscription_status: subscriptionStatus
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '24h' 
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { 
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' 
  });

  return { accessToken, refreshToken };
};

// Test avec un utilisateur creator
const token = generateToken(1, 'creator', 'free');
console.log('Access Token:', token.accessToken);
console.log('Refresh Token:', token.refreshToken);
