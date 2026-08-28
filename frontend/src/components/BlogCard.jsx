import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, ArrowRight } from 'lucide-react';

const categoryColors = {
  Technology: 'bg-blue-50 text-blue-700 border-blue-200',
  Programming: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  AI: 'bg-purple-50 text-purple-700 border-purple-200',
  'Web Development': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Lifestyle: 'bg-amber-50 text-amber-700 border-amber-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

const BlogCard = ({ post }) => {
  const { _id, title, content, category, image, author, createdAt, commentCount } = post;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const excerpt = content.length > 130 ? `${content.substring(0, 130)}...` : content;
  const authorName = author?.name || 'Anonymous Author';
  const categoryStyle = categoryColors[category] || categoryColors.Other;

  return (
    <article className="glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-slate-200 group bg-white shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
      {/* Image container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border backdrop-blur-md shadow-xs ${categoryStyle}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Content body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Author & Date */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <div className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/posts/${_id}`}>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2.5">
              {title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed font-normal">
            {excerpt}
          </p>
        </div>

        {/* Card Footer: Comments count & Read More action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>{commentCount ?? 0} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
          </div>

          <Link
            to={`/posts/${_id}`}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-700 group-hover:translate-x-1 transition-all"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
