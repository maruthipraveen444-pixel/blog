import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../services/api';
import BlogCard from '../components/BlogCard';
import { Search, Sparkles, Filter, Loader2, BookOpen } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Programming', 'AI', 'Web Development', 'Lifestyle', 'Other'];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadPosts = async (search = '', category = 'All') => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchPosts(search, category);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadPosts(searchTerm, selectedCategory);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Discover Technical Insights & Creative Stories</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Ideas, Tutorials & Insights for <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Modern Builders</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Explore articles on web development, artificial intelligence, software engineering, and digital lifestyle crafted by passionate creators.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts by title, content, or topic..."
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-md shadow-slate-200/50 transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold pr-2 border-r border-slate-200">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Category:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-105'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-sm font-semibold">Fetching latest blog posts...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center max-w-md mx-auto my-12 shadow-xs">
            <p className="font-bold text-sm mb-2">Error Loading Data</p>
            <p className="text-xs text-rose-600 mb-4">{error}</p>
            <button
              onClick={() => loadPosts(searchTerm, selectedCategory)}
              className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 bg-white shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Posts Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              {searchTerm || selectedCategory !== 'All'
                ? `No published articles matched "${searchTerm || selectedCategory}". Try clearing filters or searching for something else.`
                : 'No blog posts have been published yet. Be the first to publish one!'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
