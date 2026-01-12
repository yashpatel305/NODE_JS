import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/index.js';

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts(true);
        setPosts(data.posts || []);
      } catch (error) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Latest Blog Posts</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {post.coverImage && (
                <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content.substring(0, 150)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{post.author?.name}</span>
                  <Link to={`/post/${post.slug}`} className="text-primary hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
