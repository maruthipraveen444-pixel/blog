const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a blog post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a blog post
// @route   POST /api/posts/:postId/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      res.status(400);
      throw new Error('Comment content cannot be empty');
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      post: postId,
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private (Owner only)
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // Check comment ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComments,
  addComment,
  deleteComment,
};
