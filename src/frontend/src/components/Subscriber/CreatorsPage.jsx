import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, subscriptionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreatorsPage = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState({});
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const { user, isCreator } = useAuth();

  useEffect(() => {
    if (isCreator) {
      // Les creators n'ont pas accès à cette page
      window.location.href = '/creator/dashboard';
      return;
    }
    if (user) {
      fetchCreators();
      fetchUserSubscriptions();
    }
  }, [isCreator, user]);

  const fetchUserSubscriptions = async () => {
    try {
      console.log('Fetching user subscriptions...');
      const response = await subscriptionsAPI.getSubscriptionStatus();
      console.log('User subscriptions response:', response.data);
      setUserSubscriptions(response.data.subscriptions || []);
      console.log('Set userSubscriptions to:', response.data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
    }
  };

  const fetchCreators = async () => {
    try {
      // Récupérer tous les posts pour extraire les créateurs uniques
      const response = await postsAPI.getAllPosts();
      const posts = Array.isArray(response.data) ? response.data : response.data.posts || [];
      
      // Extraire les créateurs uniques avec leurs posts
      const creatorsMap = new Map();
      
      posts.forEach(post => {
        const creatorId = post.author_id;
        if (!creatorsMap.has(creatorId)) {
          creatorsMap.set(creatorId, {
            id: creatorId,
            username: post.author_username || `Creator_${creatorId.slice(0, 8)}`,
            email: `creator_${creatorId.slice(0, 8)}@example.com`,
            postCount: 0,
            latestPost: post,
            isSubscribed: false
          });
        }
        
        const creator = creatorsMap.get(creatorId);
        creator.postCount++;
        
        // Garder le post le plus récent
        if (!creator.latestPost || new Date(post.created_at) > new Date(creator.latestPost.created_at)) {
          creator.latestPost = post;
        }
      });

      // Convertir la Map en tableau
      const creatorsArray = Array.from(creatorsMap.values());
      
      // Vérifier les abonnements existants pour chaque creator
      if (user && userSubscriptions.length > 0) {
        console.log('Checking subscriptions for each creator...');
        console.log('User subscriptions:', userSubscriptions);
        
        creatorsArray.forEach(creator => {
          // Vérifier si l'utilisateur est abonné à ce creator spécifique
          const isSubscribed = userSubscriptions.some(sub => 
            sub.creator_id === creator.id && sub.status === 'active'
          );
          creator.isSubscribed = isSubscribed;
          console.log(`Creator ${creator.id} (${creator.username}): isSubscribed = ${isSubscribed}`);
        });
      } else {
        console.log('No user subscriptions found or user not logged in');
      }
      
      setCreators(creatorsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching creators:', error);
      setLoading(false);
    }
  };

  const handleSubscribe = async (creatorId) => {
    if (!user) {
      // Rediriger vers subscribe avec le creator_id pour s'abonner après connexion
      window.location.href = `/subscribe?creator=${creatorId}`;
      return;
    }

    setSubscribing(prev => ({ ...prev, [creatorId]: true }));

    try {
      // Rediriger vers la page de paiement Stripe pour ce creator
      window.location.href = `/subscribe?creator=${creatorId}`;
    } catch (error) {
      console.error('Error subscribing to creator:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(prev => ({ ...prev, [creatorId]: false }));
    }
  };

  if (isCreator) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Discover Creators</h1>
        <p style={{ color: '#7f8c8d' }}>
          {user ? `Welcome, ${user.username || user.email}!` : 'Welcome!'}
          Find and subscribe to your favorite content creators.
        </p>
      </div>

      {creators.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            No creators found yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="creators-grid">
          {creators.map((creator) => (
            <div key={creator.id} className="creator-card">
              <div className="creator-header">
                <div className="creator-avatar">
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#3498db',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {creator.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="creator-info">
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                    {creator.username}
                  </h3>
                  <p style={{ margin: '0', color: '#7f8c8d', fontSize: '14px' }}>
                    {creator.postCount} {creator.postCount === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </div>

              {creator.latestPost && (
                <div className="latest-post" style={{ margin: '1rem 0' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '14px', color: '#7f8c8d' }}>
                    Latest post:
                  </p>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontSize: '16px' }}>
                    {creator.latestPost.title}
                  </h4>
                  <p style={{ margin: '0', color: '#7f8c8d', fontSize: '12px' }}>
                    {new Date(creator.latestPost.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="creator-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleSubscribe(creator.id)}
                  disabled={subscribing[creator.id] || creator.isSubscribed}
                  className={`btn ${creator.isSubscribed ? 'btn-success' : 'btn-primary'}`}
                  style={{ flex: 1 }}
                >
                  {subscribing[creator.id] ? 'Subscribing...' : 
                   creator.isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
                </button>
                <Link 
                  to={`/posts?creator=${creator.id}`}
                  className="btn btn-secondary"
                  style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
                >
                  View Posts
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatorsPage;
