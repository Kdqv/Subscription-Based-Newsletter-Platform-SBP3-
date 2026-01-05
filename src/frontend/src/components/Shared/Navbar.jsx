import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isCreator } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Newsletter Platform
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>

          {!user && (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}

          {user && isCreator && (
            <>
              <Link to="/creator/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/creator/new-post" className="navbar-link">
                New Post
              </Link>
              <Link to="/creator/subscribers" className="navbar-link">
                Subscribers
              </Link>
            </>
          )}

          {user && !isCreator && (
            <>
              <Link to="/creators" className="navbar-link">
                Creators
              </Link>
              <Link to="/subscribe" className="navbar-link">
                Subscribe
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="navbar-link">
                Welcome, {user.username}
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;