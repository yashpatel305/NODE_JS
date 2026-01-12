import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postService, commentService } from '../services/index.js';

export const PostDetailPage = ({ user }) => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await postService.getPostBySlug(slug);
        setPost(postData.post);

        if (postData.post) {
          const commentsData = await commentService.getComments(postData.post._id);
          setComments(commentsData.comments || []);
        }
      } catch (error) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to comment');
      return;
    }

    try {
      const newComment = await commentService.createComment(post._id, commentText);
      setComments([newComment.comment, ...comments]);
      setCommentText('');
    } catch (error) {
      setError('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      setError('Failed to delete comment');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!post) return <div className="text-center py-8">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-96 object-cover rounded-lg mb-6" />
      )}
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="text-gray-600 mb-6">
        By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
      </div>
      
      {post.tags?.length > 0 && (
        <div className="mb-6 flex gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="prose max-w-none mb-8">{post.content}</div>
      
      <hr className="my-8" />
      
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
      
      {user && (
        <form onSubmit={handleAddComment} className="mb-6 bg-gray-100 p-4 rounded-lg">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            required
          />
          <button
            type="submit"
            className="mt-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Post Comment
          </button>
        </form>
      )}
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-bold">{comment.user?.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {user && (user._id === comment.user?._id || user.role === 'admin') && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-gray-700">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
