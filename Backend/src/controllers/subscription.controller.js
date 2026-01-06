import pool from '../db.js';

// Obtenir le statut d'abonnement de l'utilisateur
export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting subscription status for user:', userId);

    // Vérifier si l'utilisateur a un abonnement payant
    const userStatus = await pool.query(
      'SELECT subscription_status FROM users WHERE id = $1',
      [userId]
    );

    console.log('User status from DB:', userStatus.rows[0]);

    const isPaidSubscriber = userStatus.rows[0]?.subscription_status === 'paid';
    console.log('Is paid subscriber:', isPaidSubscriber);

    // Pour l'instant, on retourne pas de subscriptions car la table n'existe pas
    res.json({
      is_paid_subscriber: isPaidSubscriber,
      subscription_status: userStatus.rows[0]?.subscription_status || 'free',
      subscriptions: [] // Tableau vide pour l'instant
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ message: 'Failed to get subscription status' });
  }
};

// Obtenir tous les subscribers d'un creator
export const getCreatorSubscribers = async (req, res) => {
  try {
    const creatorId = req.user.id;

    // Pour l'instant, on retourne un tableau vide car la table subscriptions n'existe pas
    // TODO: Implémenter quand la table sera créée
    res.json([]);
  } catch (error) {
    console.error('Error getting creator subscribers:', error);
    res.status(500).json({ message: 'Failed to get subscribers' });
  }
};

// Obtenir les statistiques d'un creator
export const getCreatorStats = async (req, res) => {
  try {
    const creatorId = req.user.id;

    // Pour l'instant, on ne compte que les posts, pas les subscribers
    const postsCount = await pool.query('SELECT COUNT(*) as count FROM posts WHERE author_id = $1', [creatorId]);

    res.json({
      total_subscribers: 0, // Tableau vide pour l'instant
      total_posts: parseInt(postsCount.rows[0].count),
      paid_subscribers: 0
    });
  } catch (error) {
    console.error('Error getting creator stats:', error);
    res.status(500).json({ message: 'Failed to get stats' });
  }
};
