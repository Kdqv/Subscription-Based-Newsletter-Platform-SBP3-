import { Router } from 'express'
import { register, login, logout, me } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { refreshTokenMiddleware } from '../middlewares/refresh.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authMiddleware, me)
router.post('/refresh', refreshTokenMiddleware)

export default router
