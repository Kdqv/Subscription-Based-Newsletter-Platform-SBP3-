export const errorMiddleware = (err, req, res, next) => {
  if (err.message === 'EMAIL_ALREADY_EXISTS') {
    return res.status(409).json({ message: 'email déjà utilisé' })
  }

  if (err.message === 'INVALID_CREDENTIALS') {
    return res.status(401).json({ message: 'identifiants invalides' })
  }

  console.error(err)
  res.status(500).json({ message: 'erreur serveur' })
}
