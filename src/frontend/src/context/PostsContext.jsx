import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PostsContext = createContext(null);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    // Charger les posts depuis localStorage au démarrage
    const savedPosts = localStorage.getItem('creatorPosts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [loading, setLoading] = useState(true);
  const { isCreator } = useAuth();

  // Sauvegarder les posts dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('creatorPosts', JSON.stringify(posts));
  }, [posts]);

  // Charger les posts au montage du composant
  useEffect(() => {
    refreshPosts();
  }, []);

  const refreshPosts = async () => {
    try {
      setLoading(true);
      // Importer ici pour éviter les dépendances circulaires
      const { postsAPI } = await import('../services/api');
      const response = await postsAPI.getAllPosts();
      
      console.log('PostsContext response:', response.data); // Debug
      setPosts(Array.isArray(response.data) ? response.data : response.data.posts || []);
    } catch (error) {
      console.error('Error refreshing posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const updatePost = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const deletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const value = {
    posts,
    loading,
    refreshPosts,
    addPost,
    updatePost,
    deletePost,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
};
