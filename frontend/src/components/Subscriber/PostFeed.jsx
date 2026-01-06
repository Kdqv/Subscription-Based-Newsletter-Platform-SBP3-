import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI, subscriptionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const { user, isCreator } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    if (user && !isCreator) {
      fetchSubscriptionStatus();
    }
  }, [user, isCreator]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      console.log('Posts response:', response.data); // Debug
      const postsData = Array.isArray(response.data) ? response.data : response.data.posts || [];
      console.log('Posts loaded:', postsData); // Debug
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
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

  const canViewContent = (post) => {
    // Les creators peuvent toujours voir tout
    if (isCreator) return true;
    
    // Les posts non premium sont visibles par tout le monde
    if (!(post.is_paid_content || post.is_paid)) return true;
    
    // Les posts premium nécessitent un abonnement payant
    return subscriptionStatus?.is_paid_subscriber;
  };

  const handleReadPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleEditPost = (postId) => {
    navigate(`/creator/edit-post/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.deletePost(postId);
      // Mettre à jour la liste locale sans utiliser le contexte
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

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
        <h1 className="dashboard-title">Newsletter Feed</h1>
        <p style={{ color: '#7f8c8d' }}>
          {user ? `Welcome back, ${user.username || user.email}!` : 'Welcome!'}
          {user && !isCreator && subscriptionStatus?.is_paid_subscriber
            ? ' You have access to all premium content. Enjoy reading!'
            : user && !isCreator 
            ? ' Subscribe to access premium content, or read free posts below.'
            : user && isCreator
            ? ' Manage your posts and subscriber content.'
            : ' Sign in to access content.'}
        </p>
      </div>

      {user && !isCreator && !subscriptionStatus?.is_paid_subscriber && (
        <div className="alert alert-info">
          Want to access premium content?{' '}
          <Link to="/subscribe" style={{ fontWeight: 'bold' }}>
            Subscribe now
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
              No posts available yet.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div>
                  <h2 className="post-title">{post.title}</h2>
                  <div className="post-meta">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        By: {post.author_username || 'Unknown Author'}
                      </span>
                      <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                        Published on {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {(post.is_paid_content || post.is_paid) && (
                      <span className="post-badge">Premium</span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Bouton Read pour tout le monde */}
                  <button
                    onClick={() => handleReadPost(post.id)}
                    className="btn btn-info"
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  >
                    Read
                  </button>
                  {/* Boutons Edit/Delete seulement pour les creators sur leurs propres posts */}
                  {isCreator && post.author_id === user?.id && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditPost(post.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contenu masqué par défaut - seulement visible après clic sur Read */}
              <div style={{ 
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #e9ecef',
                color: '#6c757d',
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0 }}>
                  Click "Read" to view the full content
                  {(post.is_paid_content || post.is_paid) && !canViewContent(post) && 
                    " (Premium content - subscription required)"}
                </p>
              </div>
            </div>
          ))
        )}
    </div>
  );
};

export default PostFeed;