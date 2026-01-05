import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { postsAPI, subscriptionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostsContext';
import './Dashboard.css';

const Dashboard = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { posts, refreshPosts, deletePost, loading: postsLoading } = usePosts();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [subscribersResponse] = await Promise.all([
        subscriptionsAPI.getCreatorSubscribers(), // Utiliser la nouvelle API
        refreshPosts(),
      ]);

      setSubscribers(subscribersResponse.data);
      console.log('Creator subscribers:', subscribersResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les posts pour n'afficher que ceux du creator connecté
  const myPosts = posts.filter(post => post.author_id === user?.id);
  const paidSubscribers = subscribers.filter((sub) => sub.is_paid_subscriber);
  
  console.log('Dashboard posts:', myPosts); // Debug pour voir les données des posts

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      console.log('Deleting post:', postId);
      await postsAPI.deletePost(postId);
      console.log('Post deleted successfully, refreshing dashboard...');
      
      // Rafraîchir les données du dashboard
      await fetchDashboardData();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleEditPost = (postId) => {
    console.log('Edit post clicked:', postId);
    navigate(`/creator/edit-post/${postId}`);
  };

  const handleReadPost = (postId) => {
    console.log('Read post clicked:', postId);
    navigate(`/post/${postId}`);
  };

  if (loading || postsLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  console.log('Dashboard posts:', myPosts); // Debug pour voir les données des posts

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Creator Dashboard</h1>
        <p style={{ color: '#7f8c8d' }}>Welcome back, {user?.username || user?.email || 'Creator'}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{myPosts.length}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{subscribers.length}</div>
          <div className="stat-label">Total Subscribers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{paidSubscribers.length}</div>
          <div className="stat-label">Paid Subscribers</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="card-header" style={{ margin: 0 }}>Your Posts</h2>
          <Link to="/creator/new-post" className="btn btn-primary">
            Create New Post
          </Link>
        </div>

        {myPosts.length === 0 && !loading && !postsLoading ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            You haven't created any posts yet.{' '}
            <Link to="/creator/new-post" style={{ color: '#3498db' }}>
              Create your first post
            </Link>
          </p>
        ) : (
          <div className="posts-container">
            {myPosts.map((post) => (
              <div key={post.id} className="post-item-card">
                <div className="post-item-header">
                  <div>
                    <h3 style={{ margin: '0', color: '#2c3e50' }}>{post.title}</h3>
                    <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                      Created: {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    {post.is_paid_content || post.is_paid ? (
                      <span style={{ 
                        backgroundColor: '#e74c3c', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px' 
                      }}>
                        Premium
                      </span>
                    ) : (
                      <span style={{ 
                        backgroundColor: '#27ae60', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px' 
                      }}>
                        Free
                      </span>
                    )}
                  </div>
                </div>
                <div className="post-item-actions">
                  <button
                    onClick={() => handleReadPost(post.id)}
                    className="btn btn-info"
                    style={{ marginRight: '0.5rem', fontSize: '12px', padding: '4px 8px' }}
                  >
                    Read
                  </button>
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="btn btn-secondary"
                    style={{ marginRight: '0.5rem', fontSize: '12px', padding: '4px 8px' }}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;