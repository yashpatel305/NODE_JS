import Comment from '../models/Comment.js';

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = new Comment({
      post: postId,
      user: req.userId,
      text,
    });

    await comment.save();
    await comment.populate('user', 'name avatar');

    res.status(201).json({
      message: 'Comment created successfully',
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check authorization
    if (comment.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
};
