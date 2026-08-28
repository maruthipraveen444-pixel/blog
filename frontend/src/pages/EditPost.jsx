import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPostById, updatePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Edit3, Image, Tag, ArrowLeft, AlertCircle, Loader2, Save } from 'lucide-react';

const CATEGORIES = ['Technology', 'Programming', 'AI', 'Web Development', 'Lifestyle', 'Other'];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    image: '',
    content: '',
  });
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        setFetching(true);
        const res = await fetchPostById(id);
        const postData = res.data;

        // Check post ownership
        if (user && postData.author?._id !== user._id && postData.author !== user._id) {
          setError('You are not authorized to edit this post.');
          setFetching(false);
          return;
        }

        setFormData({
          title: postData.title || '',
          category: postData.category || 'Technology',
          image: postData.image || '',
          content: postData.content || '',
        });
      } catch (err) {
        console.error('Error fetching post for edit:', err);
        setError(err.response?.data?.message || 'Failed to load post.');
      } finally {
        setFetching(false);
      }
    };

    loadPost();
  }, [id, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, category, content } = formData;

    if (!title.trim() || !content.trim() || !category) {
      setError('Title, category, and content are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await updatePost(id, formData);
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-sm font-semibold">Loading post details for editing...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50">
      <Link
        to={`/posts/${id}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Article
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Blog Post</h1>
            <p className="text-xs text-slate-500 font-medium">Update your article content and metadata</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Post Title <span className="text-indigo-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post title"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              Category <span className="text-indigo-600">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-indigo-600" />
              Featured Cover Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium mb-3"
            />

            {formData.image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 shadow-xs">
                <img
                  src={formData.image}
                  alt="Cover preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Article Content <span className="text-indigo-600">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              placeholder="Write your blog post content..."
              required
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium leading-relaxed"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              to={`/posts/${id}`}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
