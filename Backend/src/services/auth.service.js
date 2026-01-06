import pool  from '../db.js'
import bcrypt from 'bcrypt'
import { signToken } from '../utils/token.js'

/**
 * CRÉATION DE COMPTE
 * ROLE PAR DÉFAUT : subscriber
 */
export const registerUser = async ({ email, password, role }) => {
  // vérifier si l'utilisateur existe
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [
    email,
  ])

  if (exists.rows.length > 0) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  // hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10)

  // Normaliser le rôle
  const normalizedRole = role === 'creator' ? 'creator' : 'subscriber'

  const result = await pool.query(
    `
    INSERT INTO users (email, password, role, subscription_status)
    VALUES ($1, $2, $3, 'free')
    RETURNING id, email, role, subscription_status
    `,
    [email, hashedPassword, normalizedRole]
  )

  const user = result.rows[0];

  return {
    ...user,
    username: user.email.split('@')[0], // Extraire le username depuis l'email
  }
}

/**
 * AUTHENTIFICATION
 */
export const loginUser = async ({ email, password }) => {
  const result = await pool.query(
    `
    SELECT id, email, password, role, subscription_status
    FROM users
    WHERE email = $1
    `,
    [email]
  )

  if (result.rows.length === 0) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const user = result.rows[0]

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS')
  }

  // Access token (short-lived)
  const accessToken = signToken(
    {
      userId: user.id,
      role: user.role,
      subscription_status: user.subscription_status,
    },
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  )

  // Refresh token (long-lived)
  const refreshToken = signToken(
    {
      userId: user.id,
    },
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  )

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.email.split('@')[0], // Extraire le username depuis l'email
      role: user.role,
      subscription_status: user.subscription_status,
    },
  }
}
