import Post from '../models/Post.js';
import slugify from 'slugify';

export const getPosts = async (req, res) => {
  try {
    const { published } = req.query;
    const query = published === 'true' ? { published: true } : {};

    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug })
      .populate('author', 'name email avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, coverImage, tags, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let slug = slugify(title, { lower: true, strict: true });
    let existingPost = await Post.findOne({ slug });
    let counter = 1;

    while (existingPost) {
      slug = slugify(title, { lower: true, strict: true }) + `-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const post = new Post({
      title,
      slug,
      content,
      coverImage: coverImage || null,
      author: req.userId,
      tags: tags || [],
      published: published || false,
    });

    await post.save();
    await post.populate('author', 'name email avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, coverImage, tags, published } = req.body;

    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (post.author.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    if (title && title !== post.title) {
      let slug = slugify(title, { lower: true, strict: true });
      let existingPost = await Post.findOne({ slug, _id: { $ne: id } });
      let counter = 1;

      while (existingPost) {
        slug = slugify(title, { lower: true, strict: true }) + `-${counter}`;
        existingPost = await Post.findOne({ slug, _id: { $ne: id } });
        counter++;
      }

      post.slug = slug;
      post.title = title;
    }

    if (content) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags) post.tags = tags;
    if (published !== undefined) post.published = published;

    await post.save();
    await post.populate('author', 'name email avatar');

    res.status(200).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization
    if (post.author.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};
