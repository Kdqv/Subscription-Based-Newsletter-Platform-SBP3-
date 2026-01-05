import { Router } from 'express'
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getCreatorPosts,
} from '../controllers/post.controller.js'
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

// Creator-specific routes (doit venir AVANT /:id)
router.get('/creator/my-posts', authMiddleware, getCreatorPosts)

// Standard RESTful paths expected by frontend
router.get('/', optionalAuthMiddleware, getAllPosts)
router.get('/:id', optionalAuthMiddleware, getPostById)
router.post('/', authMiddleware, createPost)
router.put('/:id', authMiddleware, updatePost)
router.delete('/:id', authMiddleware, deletePost)

export default router
