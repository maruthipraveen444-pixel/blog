import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserPosts, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  PenSquare, 
  BookOpen, 
  MessageSquare, 
  Eye, 
  Edit3, 
  Trash2, 
  Loader2, 
  Plus, 
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUserPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchUserPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError(err.response?.data?.message || 'Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserPosts();
  }, []);

  const handleDeletePost = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deletePost(deleteTarget._id);
      setPosts(posts.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.message || 'Failed to delete post.');
    } finally {
      setDeleting(false);
    }
  };

  const totalComments = posts.reduce((acc, p) => acc + (p.commentCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 rounded-3xl shadow-xl shadow-indigo-600/15 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-200">Creator Dashboard</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-indigo-100 text-sm mt-1 font-medium">Manage your published articles, track reader feedback, and share new stories.</p>
        </div>

        <Link
          to="/create-post"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-indigo-900 bg-white hover:bg-indigo-50 shadow-lg shadow-black/10 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Total Posts Created</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{posts.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Comments Received</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalComments}</p>
          </div>
        </div>
      </div>

      {/* My Posts Management Table / List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <PenSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">My Articles</h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
          </span>
        </div>

        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-sm font-semibold">Loading your articles...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium mb-4">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-900 font-bold text-base mb-1">No articles published yet</p>
            <p className="text-slate-500 text-xs font-medium mb-6">Create your first blog post and start sharing your thoughts.</p>
            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Write First Post
            </Link>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4">Comments</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {posts.map((post) => {
                  const dateStr = new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={post._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 max-w-xs truncate">
                        <Link to={`/posts/${post._id}`} className="hover:text-indigo-600 transition-colors">
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 font-semibold">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{post.commentCount ?? 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/posts/${post._id}`}
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="View Article"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/edit-post/${post._id}`}
                            className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Article"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(post)}
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Deletion</h3>
            <p className="text-slate-600 text-sm mb-6">
              Are you sure you want to delete <span className="text-slate-900 font-bold">"{deleteTarget.title}"</span>? This will also remove all associated comments.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
              >
                {deleting ? (
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

export default Dashboard;
