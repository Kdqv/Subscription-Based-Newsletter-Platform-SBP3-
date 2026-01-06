import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createPaymentSession, confirmPayment, mockPayment } from '../controllers/payment.controller.js';

const router = Router();

// Créer une session de paiement Stripe
router.post('/create-checkout-session', authMiddleware, createPaymentSession);

// Confirmer le paiement après retour de Stripe
router.get('/confirm', authMiddleware, confirmPayment);

// Simuler un paiement (mode test)
router.post('/mock', authMiddleware, mockPayment);

export default router;
