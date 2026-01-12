import express from 'express';
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:slug', getPostBySlug);
router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

export default router;
