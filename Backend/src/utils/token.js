import jwt from 'jsonwebtoken'

/**
 * Sign a JWT token.
 * options: { expiresIn, secret }
 */
export const signToken = (payload, options = {}) => {
  const secret = options.secret || process.env.JWT_SECRET
  const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN

  return jwt.sign(payload, secret, { expiresIn })
}
