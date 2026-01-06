import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PostView = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      console.log('Fetching post with ID:', id);
      const response = await postsAPI.getPostById(id);
      const postData = response.data.post || response.data; // Gérer les deux formats
      console.log('Post data received:', postData);
      
      if (!postData) {
        setError('Post not found');
        return;
      }
      
      setPost(postData);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center', color: '#e74c3c' }}>{error || 'Post not found'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // logique d'accès MVP côté frontend
  const hasAccess =
    !(post?.is_paid_content || post?.is_paid) ||
    (user && (user.role === 'admin' || user.role === 'creator' || user.subscription_status === 'paid' || user.subscription_status === 'premium')) ||
    (user && post.author_id === user.id) // Le creator peut toujours voir ses propres posts

  if ((post?.is_paid_content || post?.is_paid) && !hasAccess) {
    return (
      <div className="container">
        <div className="card">
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              ← Back
            </button>
          </div>
          
          <h1 style={{ 
            marginBottom: '1rem', 
            color: '#2c3e50',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            {post.title}
          </h1>
          
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ 
              backgroundColor: '#e74c3c', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Premium Content
            </span>
            <span style={{ marginLeft: '1rem', color: '#7f8c8d', fontSize: '14px' }}>
              Published on {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
            </span>
          </div>
          
          <div style={{ 
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6c757d'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>This is premium content</h3>
            <p style={{ marginBottom: '1.5rem' }}>Subscribe to access this article and all premium content from our creators.</p>
            <Link to="/subscribe" className="btn btn-primary" style={{ marginRight: '1rem' }}>
              Subscribe Now
            </Link>
            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Back
          </button>
        </div>
        
        <h1 style={{ 
          marginBottom: '1rem', 
          color: '#2c3e50',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          lineHeight: '1.2'
        }}>
          {post.title}
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          {post.is_paid_content || post.is_paid ? (
            <span style={{ 
              backgroundColor: '#e74c3c', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Premium Content
            </span>
          ) : (
            <span style={{ 
              backgroundColor: '#27ae60', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '6px', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Free Content
            </span>
          )}
          <span style={{ marginLeft: '1rem', color: '#7f8c8d', fontSize: '14px' }}>
            Published on {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
          </span>
        </div>
        
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ 
            lineHeight: '1.8', 
            fontSize: '18px',
            color: '#2c3e50',
            border: '1px solid #ecf0f1',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            minHeight: '300px'
          }}
        />
        
        {user?.role === 'creator' && (
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ecf0f1' }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Creator Actions</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => navigate(`/creator/edit-post/${post.id}`)}
                className="btn btn-secondary"
              >
                Edit Post
              </button>
              <button
                onClick={() => navigate('/creator/dashboard')}
                className="btn btn-primary"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostView;
