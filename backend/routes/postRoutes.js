const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
} = require('../controllers/postController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Post endpoints
router.get('/', getPosts);
router.get('/user/my-posts', protect, getUserPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Comments nested endpoints on post
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, addComment);

module.exports = router;
