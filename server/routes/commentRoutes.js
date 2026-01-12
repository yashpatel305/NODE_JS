import express from 'express';
import {
  getCommentsByPost,
  createComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:postId', getCommentsByPost);
router.post('/:postId', protect, createComment);
router.delete('/:commentId', protect, deleteComment);

export default router;
