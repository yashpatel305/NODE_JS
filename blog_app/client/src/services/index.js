import api from './api.js';

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export const postService = {
  getPosts: async (published = false) => {
    const response = await api.get('/posts', {
      params: { published },
    });
    return response.data;
  },

  getPostBySlug: async (slug) => {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

export const commentService = {
  getComments: async (postId) => {
    const response = await api.get(`/comments/${postId}`);
    return response.data;
  },

  createComment: async (postId, text) => {
    const response = await api.post(`/comments/${postId}`, { text });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};
