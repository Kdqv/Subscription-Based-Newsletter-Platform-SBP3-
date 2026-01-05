import { createCheckoutSession, getSessionStatus } from '../services/stripe.service.js';
import { pool } from '../config/db.js';

// Créer une session de paiement
export const createPaymentSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const session = await createCheckoutSession(userId, userEmail);
    
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ message: 'Failed to create payment session' });
  }
};

// Confirmer le paiement après succès
export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    const userId = req.user.id;

    if (!session_id) {
      return res.status(400).json({ message: 'Session ID required' });
    }

    // Vérifier la session Stripe
    const session = await getSessionStatus(session_id);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Mettre à jour le statut d'abonnement de l'utilisateur
    await pool.query(
      'UPDATE users SET subscription_status = $1 WHERE id = $2',
      ['paid', userId]
    );

    res.json({ 
      message: 'Payment successful! You are now subscribed.',
      subscriptionStatus: 'paid'
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// Simuler un paiement (mode test)
export const mockPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    // Simuler un paiement réussi
    await pool.query(
      'UPDATE users SET subscription_status = $1 WHERE id = $2',
      ['paid', userId]
    );

    // Pour l'instant, on skip la création dans subscriptions car la table n'existe pas
    // TODO: Créer la table subscriptions plus tard
    
    res.json({ message: 'Test payment successful! You are now subscribed.' });
  } catch (error) {
    console.error('Error with mock payment:', error);
    res.status(500).json({ message: 'Payment failed' });
  }
};
