import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mobileAuthAPI } from '../../services/mobile-api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user, isCreator, setUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate(isCreator ? '/creator/dashboard' : '/');
    }
  }, [user, isCreator, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== UNIFIED LOGIN ===');
    console.log('Form data:', formData);

    try {
      // Utiliser l'API normale pour tout le monde
      const result = await login(formData);
      console.log('Login result:', result);

      if (result.success) {
        // Navigation handled by useEffect
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Gérer les erreurs spécifiques
      if (error.code === 'ECONNABORTED') {
        setError('Connection timeout - check your network');
      } else if (error.message.includes('Network Error')) {
        setError('Network error - cannot reach server');
      } else {
        setError('Login failed - please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-small">
      <div className="card">
        <h2 className="card-header">Login</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#3498db' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;