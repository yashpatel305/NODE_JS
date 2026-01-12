import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/index.js';

export const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    tags: '',
    published: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        coverImage: formData.coverImage || null,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        published: formData.published,
      };

      await postService.createPost(postData);
      navigate('/posts');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="10"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="react, javascript, web"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium">Publish immediately</label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};
