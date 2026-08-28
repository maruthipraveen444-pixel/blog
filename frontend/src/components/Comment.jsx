import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Comment = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const { _id, content, author, createdAt } = comment;

  const isOwner = user && (user._id === author?._id || user._id === author);
  const authorName = author?.name || 'Anonymous User';

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{authorName}</h4>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => onDelete(_id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-sm text-slate-700 pl-10 leading-relaxed whitespace-pre-line font-normal">
        {content}
      </p>
    </div>
  );
};

export default Comment;
