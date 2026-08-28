const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get all posts (with search and category filter + comment count)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { category: searchRegex },
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    // Fetch comment counts for each post in parallel
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.json(postsWithCommentCount);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    const commentCount = await Comment.countDocuments({ post: post._id });

    res.json({
      ...post.toObject(),
      commentCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content || !category) {
      res.status(400);
      throw new Error('Title, content, and category are required fields');
    }

    const postData = {
      title,
      content,
      category,
      author: req.user._id,
    };

    if (image && image.trim() !== '') {
      postData.image = image.trim();
    }

    const post = await Post.create(postData);
    const populatedPost = await Post.findById(post._id).populate('author', 'name email');

    res.status(201).json({
      ...populatedPost.toObject(),
      commentCount: 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing post
// @route   PUT /api/posts/:id
// @access  Private (Owner only)
const updatePost = async (req, res, next) => {
  try {
    const { title, content, category, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Verify post ownership
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to edit this post');
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (image !== undefined) {
      post.image = image.trim() !== '' ? image.trim() : post.image;
    }

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate('author', 'name email');
    const commentCount = await Comment.countDocuments({ post: updatedPost._id });

    res.json({
      ...populatedPost.toObject(),
      commentCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Owner only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Verify post ownership
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }

    // Delete post and associated comments
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post and associated comments removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posts
// @route   GET /api/posts/user/my-posts
// @access  Private
const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.json(postsWithCommentCount);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
};
