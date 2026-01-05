import { registerUser, loginUser } from '../services/auth.service.js'

export const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body
    const user = await registerUser({ email, password, role })

    res.status(201).json({
      message: 'utilisateur créé',
      user,
    })
  } catch (err) {
    if (err.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ message: 'email déjà utilisé' })
    }
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await loginUser({ email, password })

    res.status(200).json({
      message: 'connexion réussie',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    })
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res
        .status(401)
        .json({ message: 'email ou mot de passe incorrect' })
    }
    next(err)
  }
}

export const logout = async (req, res) => {
  res.status(200).json({ message: 'déconnexion réussie' })
}

export const me = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'non authentifié' })
    }

    res.status(200).json({ user: req.user })
  } catch (err) {
    next(err)
  }
}
