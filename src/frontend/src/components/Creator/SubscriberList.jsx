import React, { useState, useEffect } from 'react';
import { subscriptionsAPI } from '../../services/api';

const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await subscriptionsAPI.getSubscribers();
      setSubscribers(response.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const paidSubscribers = subscribers.filter((sub) => sub.is_paid_subscriber);
  const freeSubscribers = subscribers.filter((sub) => !sub.is_paid_subscriber);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Subscriber Management</h1>
        <p style={{ color: '#7f8c8d' }}>
          Manage and view all your subscribers
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{subscribers.length}</div>
          <div className="stat-label">Total Subscribers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{paidSubscribers.length}</div>
          <div className="stat-label">Paid Subscribers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{freeSubscribers.length}</div>
          <div className="stat-label">Free Subscribers</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-header">All Subscribers</h2>

        {subscribers.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            No subscribers yet. Share your content to attract subscribers!
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td>{subscriber.username}</td>
                    <td>{subscriber.email}</td>
                    <td>
                      {subscriber.is_paid_subscriber ? (
                        <span className="post-badge">Paid</span>
                      ) : (
                        <span style={{ color: '#95a5a6' }}>Free</span>
                      )}
                    </td>
                    <td>
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Subscriber Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ color: '#3498db', marginBottom: '0.5rem' }}>
              Conversion Rate
            </h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {subscribers.length > 0
                ? Math.round((paidSubscribers.length / subscribers.length) * 100)
                : 0}
              %
            </p>
            <p style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>
              Free to Paid conversion
            </p>
          </div>
          <div>
            <h4 style={{ color: '#27ae60', marginBottom: '0.5rem' }}>
              Estimated Revenue
            </h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              ${(paidSubscribers.length * 9.99).toFixed(2)}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>
              Monthly recurring revenue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriberList;