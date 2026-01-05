import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { subscriptionsAPI, paymentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const { user, isCreator } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const creatorId = searchParams.get('creator');

  useEffect(() => {
    console.log('=== SUBSCRIPTION PAGE DEBUG ===');
    console.log('User:', user);
    console.log('IsCreator:', isCreator);
    console.log('CreatorId from URL:', creatorId);
    
    if (isCreator) {
      navigate('/creator/dashboard');
      return;
    }

    // Si on vient de la page creators avec un creator_id
    if (creatorId) {
      fetchCreatorInfo();
    }

    // Si l'utilisateur est connecté, on récupère son statut
    if (user) {
      console.log('User is connected, fetching subscription status...');
      fetchSubscriptionStatus();
    } else {
      console.log('User is NOT connected, showing login options');
    }
    // Si non connecté, on reste sur la page pour permettre l'abonnement
  }, [user, isCreator, navigate, creatorId]);

  const fetchCreatorInfo = async () => {
    try {
      // Récupérer tous les posts pour trouver le creator
      const response = await subscriptionsAPI.getSubscriptionStatus();
      // Pour l'instant, on affiche juste l'ID du creator
      setCreatorInfo({
        id: creatorId,
        name: `Creator_${creatorId.slice(0, 8)}`
      });
    } catch (error) {
      console.error('Error fetching creator info:', error);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await subscriptionsAPI.getSubscriptionStatus();
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  const handleStripePayment = async () => {
    // Si l'utilisateur n'est pas connecté, rediriger vers login
    if (!user) {
      navigate(`/login?redirect=/subscribe${creatorId ? `?creator=${creatorId}` : ''}`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Creating Stripe checkout session...');
      const response = await paymentsAPI.createCheckoutSession();
      console.log('Stripe session created:', response.data);
      
      if (response.data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = response.data.url;
      } else {
        setError('Failed to create payment session');
        setLoading(false);
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      setError('Failed to create payment session. Please try again.');
      setLoading(false);
    }
  };

  const handleMockPayment = async () => {
    // Si l'utilisateur n'est pas connecté, rediriger vers login
    if (!user) {
      navigate('/login?redirect=/subscribe');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await paymentsAPI.mockPayment();
      setSuccess(response.data.message);
      
      setTimeout(() => {
        fetchSubscriptionStatus();
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (isCreator) {
    return null;
  }

  return (
    <div className="container-small">
      <div className="card">
        <h2 className="card-header">
          {creatorInfo ? `Subscribe to ${creatorInfo.name}` : 'Subscription'}
        </h2>
        
        {creatorInfo && (
          <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
            You're subscribing to {creatorInfo.name}. Get access to all their premium content!
          </div>
        )}
        
        {!user ? (
          <div>
            <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
              Subscribe to access premium content from your favorite creators!
            </p>
            <div className="alert alert-info">
              Please <Link to={`/login?redirect=/subscribe${creatorId ? `?creator=${creatorId}` : ''}`} style={{ fontWeight: 'bold' }}>sign in</Link> or{' '}
              <Link to={`/register?redirect=/subscribe${creatorId ? `?creator=${creatorId}` : ''}`} style={{ fontWeight: 'bold' }}>create an account</Link>{' '}
              to subscribe.
            </div>
          </div>
        ) : (
          <div>
        <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
          Welcome, {user?.username || user?.email || 'Subscriber'}!
        </p>

        {subscriptionStatus?.is_paid_subscriber ? (
          <div>
            <div className="alert alert-success">
              You are currently subscribed! You have access to all premium content.
            </div>
            <div className="form-group">
              <label className="form-label">Subscription Status</label>
              <p style={{ color: '#27ae60', fontWeight: 'bold' }}>Active</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="alert alert-info">
              Subscribe to access all premium content from our creators.
            </div>

            <div className="form-group">
              <h3 style={{ marginBottom: '1rem' }}>Premium Subscription</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
                $9.99/month
              </p>
              <ul style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                <li>Access to all premium articles</li>
                <li>Exclusive content from creators</li>
                <li>Ad-free reading experience</li>
                <li>Support independent creators</li>
              </ul>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
              <button
                onClick={handleStripePayment}
                className="btn btn-primary"
                disabled={loading}
                style={{ 
                  flex: 1, 
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Processing...' : '💳 Pay with Card - $9.99/month'}
              </button>
              
              <button
                onClick={handleMockPayment}
                className="btn btn-success"
                disabled={loading}
                style={{ 
                  flex: 1,
                  padding: '0.75rem'
                }}
              >
                {loading ? 'Processing...' : '🧪 Test Mode (Free)'}
              </button>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <p style={{ fontSize: '0.875rem', color: '#7f8c8d', margin: 0 }}>
                <strong>💳 Stripe:</strong> Real payment with test card (4242 4242 4242 4242)<br/>
                <strong>🧪 Test Mode:</strong> Free instant access for testing
              </p>
            </div>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;