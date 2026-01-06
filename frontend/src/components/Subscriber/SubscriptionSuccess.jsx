import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await paymentsAPI.confirmPayment(sessionId);
        setSuccess(response.data.message);
        
        // Mettre à jour le contexte utilisateur
        if (user) {
          user.subscription_status = 'paid';
        }
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to confirm payment');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, navigate, user]);

  if (loading) {
    return (
      <div className="container-small">
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem' }}>Confirming your subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-small">
      <div className="card">
        <h2 className="card-header">Subscription Status</h2>
        
        {success ? (
          <div>
            <div className="alert alert-success">
              ✅ {success}
            </div>
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
              You will be redirected to the home page in 3 seconds...
            </p>
          </div>
        ) : (
          <div>
            <div className="alert alert-error">
              ❌ {error}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button 
                onClick={() => navigate('/subscribe')}
                className="btn btn-primary"
              >
                Back to Subscription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
