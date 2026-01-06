import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import Navbar from './components/Shared/Navbar';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import PostView from './components/Shared/PostView';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MobileRegister from './components/Auth/MobileRegister';
import TestAuth from './components/Auth/TestAuth';
import PostFeed from './components/Subscriber/PostFeed';
import './styles/mobile.css';
import CreatorsPage from './components/Subscriber/CreatorsPage';
import SubscriptionPage from './components/Subscriber/SubscriptionPage';
import SubscriptionSuccess from './components/Subscriber/SubscriptionSuccess';
import Dashboard from './components/Creator/Dashboard';
import PostEditor from './components/Creator/PostEditor';
import SubscriberList from './components/Creator/SubscriberList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="main-content">
              <Routes>
                {/* Routes publiques */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/mobile-register" element={<MobileRegister />} />
                <Route path="/test-auth" element={<TestAuth />} />
                <Route path="/" element={<PostFeed />} />
                <Route path="/creators" element={<CreatorsPage />} />
                <Route path="/subscribe" element={<SubscriptionPage />} />
                <Route path="/subscribe/success" element={<SubscriptionSuccess />} />
                <Route path="/post/:id" element={<PostView />} />

                {/* Routes Creator */}
                <Route
                  path="/creator/dashboard"
                  element={
                    <ProtectedRoute requiredRole="creator">
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/creator/new-post"
                  element={
                    <ProtectedRoute requiredRole="creator">
                      <PostEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/creator/edit-post/:id"
                  element={
                    <ProtectedRoute requiredRole="creator">
                      <PostEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/creator/subscribers"
                  element={
                    <ProtectedRoute requiredRole="creator">
                      <SubscriberList />
                    </ProtectedRoute>
                  }
                />

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;