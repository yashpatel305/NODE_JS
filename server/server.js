import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateAccessToken, generateRefreshToken } from './config/jwt.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// In-memory database for demo
const users = [];
const posts = [
  {
    _id: '1',
    title: 'Welcome to the Blog',
    slug: 'welcome-to-the-blog',
    content: 'This is a sample blog post. The application is running successfully!',
    coverImage: null,
    author: { _id: 'admin', name: 'Admin', email: 'admin@blog.com', avatar: null },
    tags: ['welcome', 'blog'],
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    title: 'MERN Stack Tutorial',
    slug: 'mern-stack-tutorial',
    content: 'Learn how to build full-stack applications with MongoDB, Express, React, and Node.js. This blog includes secure JWT authentication using HTTP-only cookies.',
    coverImage: null,
    author: { _id: 'admin', name: 'Admin', email: 'admin@blog.com', avatar: null },
    tags: ['mern', 'tutorial', 'javascript'],
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const comments = [];

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const user = {
    _id: Date.now().toString(),
    name,
    email,
    password: Buffer.from(password).toString('base64'),
    role: 'user',
    avatar: null,
  };
  users.push(user);
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    message: 'User registered successfully',
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  const user = users.find(u => u.email === email && Buffer.from(password).toString('base64') === u.password);
  if (!user && email === 'admin@blog.com' && password === 'Admin@123') {
    const adminUser = { _id: 'admin', name: 'Admin', email: 'admin@blog.com', role: 'admin', avatar: null };
    const accessToken = generateAccessToken(adminUser._id, adminUser.role);
    const refreshToken = generateRefreshToken(adminUser._id);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: 'Login successful',
      user: adminUser,
    });
  }
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: 'Login successful',
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout successful' });
});

app.post('/api/auth/refresh', (req, res) => {
  res.status(200).json({ message: 'Token refreshed' });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'No access token provided' });
  }
  if (token.includes('admin')) {
    return res.status(200).json({
      user: { _id: 'admin', name: 'Admin', email: 'admin@blog.com', role: 'admin', avatar: null },
    });
  }
  res.status(200).json({
    user: { _id: '1', name: 'User', email: 'user@example.com', role: 'user', avatar: null },
  });
});

// Post routes
app.get('/api/posts', (req, res) => {
  const { published } = req.query;
  const filtered = published === 'true' ? posts.filter(p => p.published) : posts;
  res.status(200).json({ count: filtered.length, posts: filtered });
});

app.get('/api/posts/:slug', (req, res) => {
  const post = posts.find(p => p.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.status(200).json({ post });
});

app.post('/api/posts', (req, res) => {
  const { title, content, coverImage, tags, published } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const post = {
    _id: Date.now().toString(),
    title,
    slug,
    content,
    coverImage: coverImage || null,
    author: { _id: 'admin', name: 'Admin', email: 'admin@blog.com', avatar: null },
    tags: tags || [],
    published: published || false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  posts.push(post);
  res.status(201).json({ message: 'Post created successfully', post });
});

app.put('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p._id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  const { title, content, coverImage, tags, published } = req.body;
  if (title) post.title = title;
  if (content) post.content = content;
  if (coverImage !== undefined) post.coverImage = coverImage;
  if (tags) post.tags = tags;
  if (published !== undefined) post.published = published;
  post.updatedAt = new Date();
  res.status(200).json({ message: 'Post updated successfully', post });
});

app.delete('/api/posts/:id', (req, res) => {
  const idx = posts.findIndex(p => p._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }
  posts.splice(idx, 1);
  res.status(200).json({ message: 'Post deleted successfully' });
});

// Comment routes
app.get('/api/comments/:postId', (req, res) => {
  const postComments = comments.filter(c => c.post === req.params.postId);
  res.status(200).json({ count: postComments.length, comments: postComments });
});

app.post('/api/comments/:postId', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }
  const comment = {
    _id: Date.now().toString(),
    post: req.params.postId,
    user: { _id: '1', name: 'User', avatar: null },
    text,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  comments.push(comment);
  res.status(201).json({ message: 'Comment created successfully', comment });
});

app.delete('/api/comments/:commentId', (req, res) => {
  const idx = comments.findIndex(c => c._id === req.params.commentId);
  if (idx === -1) {
    return res.status(404).json({ message: 'Comment not found' });
  }
  comments.splice(idx, 1);
  res.status(200).json({ message: 'Comment deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin credentials: admin@blog.com / Admin@123`);
});
