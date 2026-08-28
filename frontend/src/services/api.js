import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to inject Bearer token into headers if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const fetchCurrentUser = () => API.get('/auth/me');

// Posts API calls
export const fetchPosts = (search = '', category = '') => {
  let url = '/posts?';
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (category && category !== 'All') url += `category=${encodeURIComponent(category)}`;
  return API.get(url);
};

export const fetchPostById = (id) => API.get(`/posts/${id}`);
export const fetchUserPosts = () => API.get('/posts/user/my-posts');
export const createPost = (postData) => API.post('/posts', postData);
export const updatePost = (id, postData) => API.put(`/posts/${id}`, postData);
export const deletePost = (id) => API.delete(`/posts/${id}`);

// Comments API calls
export const fetchComments = (postId) => API.get(`/posts/${postId}/comments`);
export const addComment = (postId, commentData) => API.post(`/posts/${postId}/comments`, commentData);
export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`);

export default API;
