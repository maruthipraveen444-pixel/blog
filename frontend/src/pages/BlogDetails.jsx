import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPostById, deletePost, fetchComments, addComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Comment from '../components/Comment';
import { 
  Calendar, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Send, 
  Loader2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const isOwner = user && post && (user._id === post.author?._id || user._id === post.author);

  const loadPostAndComments = async () => {
    try {
      setLoading(true);
      setError('');
      const [postRes, commentsRes] = await Promise.all([
        fetchPostById(id),
        fetchComments(id),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error('Error fetching blog details:', err);
      setError(err.response?.data?.message || 'Failed to load blog post details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostAndComments();
  }, [id]);

  const handlePostDelete = async () => {
    try {
      setDeletingPost(true);
      await deletePost(id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.response?.data?.message || 'Failed to delete post.');
      setShowDeleteModal(false);
    } finally {
      setDeletingPost(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Comment text cannot be empty.');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError('');
      const res = await addComment(id, { content: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
      setPost((prev) => prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : prev);
    } catch (err) {
      console.error('Error adding comment:', err);
      setCommentError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      setPost((prev) => prev ? { ...prev, commentCount: Math.max(0, (prev.commentCount || 0) - 1) } : prev);
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.message || 'Could not delete comment.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-sm font-semibold">Loading article details...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'The requested blog post could not be located.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Articles
      </Link>

      {/* Header Info */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-xs">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Published on {formattedDate}</span>
          </div>
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 italic font-medium">
              <Clock className="w-3 h-3" />
              <span>Updated</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author details & owner actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-xs">
              {(post.author?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{post.author?.name || 'Anonymous Author'}</p>
              <p className="text-xs text-slate-500 font-medium">{post.author?.email}</p>
            </div>
          </div>

          {/* Owner options */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Post
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Featured Cover Image */}
      {post.image && (
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-slate-100 border border-slate-200 shadow-md max-h-[450px]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover max-h-[450px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>
      )}

      {/* Body Content */}
      <article className="prose max-w-none mb-16 text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line border-b border-slate-200 pb-12 font-normal">
        {post.content}
      </article>

      {/* Comments Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Comments <span className="text-slate-500 text-sm font-semibold">({post.commentCount ?? comments.length})</span>
            </h3>
          </div>
        </div>

        {/* Add comment form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Join the conversation
              </h4>

              {commentError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{commentError}</span>
                </div>
              )}

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your thoughts or feedback..."
                rows={3}
                required
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none font-medium"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {submittingComment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Comment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-600 font-medium mb-3">You must be logged in to post comments.</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Log In to Comment
              </Link>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-dashed border-slate-300">
              <p className="text-slate-500 text-sm font-medium">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment key={comment._id} comment={comment} onDelete={handleDeleteComment} />
            ))
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Blog Post?</h3>
            <p className="text-slate-600 text-sm mb-6">
              Are you sure you want to delete <span className="text-slate-900 font-bold">"{post.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePostDelete}
                disabled={deletingPost}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                {deletingPost ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
