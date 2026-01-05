import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: 'token manquant',
      })
    }
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'token invalide',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: decoded.userId,
      role: decoded.role,
      subscription_status: decoded.subscription_status,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'token invalide ou expiré',
    })
  }
}

export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return next()
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      subscription_status: decoded.subscription_status,
    }
    next()
  } catch (error) {
    // Si le token est invalide dans un contexte optionnel, on continue simplement sans utilisateur connecté
    next()
  }
}
