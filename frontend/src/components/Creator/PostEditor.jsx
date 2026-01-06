import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postsAPI } from '../../services/api';
import { usePosts } from '../../context/PostsContext';
import { useAuth } from '../../context/AuthContext';

const PostEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_paid_content: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const { addPost, updatePost } = usePosts();
  const { user } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getPostById(id);
      const post = response.data.post || response.data; // Gérer les deux formats de réponse
      console.log('Fetched post:', post); // Debug
      
      // Vérifier que l'utilisateur est bien l'auteur du post
      if (post.author_id !== user?.id && user?.role !== 'admin') {
        setError('You are not authorized to edit this post');
        return;
      }
      
      setFormData({
        title: post.title,
        content: post.content,
        is_paid_content: post.is_paid_content || post.is_paid || false, // Gérer les deux noms de champs
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      setError('Content is required');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (id) {
        console.log('Updating post:', id, formData);
        response = await postsAPI.updatePost(id, formData);
        updatePost(response.data); // Mettre à jour dans le contexte
      } else {
        console.log('Creating post:', formData);
        response = await postsAPI.createPost(formData);
        console.log('Created post response:', response.data);
        addPost(response.data); // Ajouter au contexte
      }
      navigate('/creator/dashboard');
    } catch (error) {
      console.error('Error saving post:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to save post');
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'align',
    'link',
  ];

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-header">
          {isEditMode ? 'Edit Post' : 'Create New Post'}
        </h2>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your post title"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Post Content</label>
            <div className="editor-container">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your content here..."
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_paid_content"
                className="form-checkbox"
                checked={formData.is_paid_content}
                onChange={handleChange}
              />
              <span>Mark as Premium Content (Paid Subscribers Only)</span>
            </label>
            <p style={{ fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
              If checked, only paid subscribers will be able to read this post.
            </p>
          </div>

          <div className="post-actions">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : isEditMode
                ? 'Update Post'
                : 'Publish Post'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/creator/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditor;