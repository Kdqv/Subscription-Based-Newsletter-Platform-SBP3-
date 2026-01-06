import express from 'express'
import cors from 'cors';
import pool from './db.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { authMiddleware } from './middlewares/auth.middleware.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import paymentRoutes from './routes/payment.route.js'
import subscriptionRoutes from './routes/subscription.route.js'

// Variables d'environnement temporairement
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.JWT_SECRET = process.env.JWT_SECRET || '0e5948c5d6e572d81bd3620e816fa2b680befe633171320d39a733491bb4e924';
process.env.ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
process.env.REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://newsletter_platform_user:g8hhyoS68Z6U4Ln8nzOzoViQRsZl6V3t@dpg-d5e5j43uibrs73c8r8p0-a/newsletter_platform';

const app = express()
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://10.4.2.127:3000', /^http:\/\/192\.168\.\d+\.\d+:\d+$/, 'https://subscription-based-newsletter-platform-rgzg.onrender.com'], 
  credentials: true 
}));
app.use(express.json())

// Route de santé pour vérifier que le backend fonctionne
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/subscriptions', subscriptionRoutes)

// Profile endpoint pour obtenir les infos de l'utilisateur connecté
app.get('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer les infos de l'utilisateur depuis la base de données
    const result = await pool.query(
      'SELECT id, email, username, role, subscription_status, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in profile endpoint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.get('/db-test', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
})

app.use(errorMiddleware)

export default app
