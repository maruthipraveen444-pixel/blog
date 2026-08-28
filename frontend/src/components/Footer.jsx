import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg text-slate-900">
            Echo<span className="text-indigo-600">Blog</span>
          </span>
          <span className="text-xs text-slate-400 ml-2">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using MERN & Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
