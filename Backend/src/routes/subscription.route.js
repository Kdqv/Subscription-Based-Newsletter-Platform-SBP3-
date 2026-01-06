import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getSubscriptionStatus, getCreatorSubscribers, getCreatorStats } from '../controllers/subscription.controller.js';

const router = Router();

// Obtenir le statut d'abonnement de l'utilisateur
router.get('/status', authMiddleware, getSubscriptionStatus);

// Obtenir les subscribers du creator connecté
router.get('/creator/subscribers', authMiddleware, getCreatorSubscribers);

// Obtenir les statistiques du creator connecté
router.get('/creator/stats', authMiddleware, getCreatorStats);

export default router;
