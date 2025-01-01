'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KeywordCloud({ allKeywords = [] }) {
  const [visibleKeywords, setVisibleKeywords] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const DISPLAY_COUNT = 10; // 每次显示的关键词数量
  const REFRESH_INTERVAL = 8000; // 增加刷新间隔到8秒

  const handleKeywordClick = (keyword) => {
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  // 随机选择关键词
  const refreshKeywords = () => {
    setIsRefreshing(true);
    const shuffled = [...allKeywords].sort(() => 0.5 - Math.random());
    setVisibleKeywords(shuffled.slice(0, DISPLAY_COUNT));
    setTimeout(() => setIsRefreshing(false), 300);
  };

  // 初始化和自动轮换
  useEffect(() => {
    refreshKeywords();
    const interval = setInterval(refreshKeywords, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [allKeywords]);

  return (
    <div className="latest-posts-sidebar bg-white/50 backdrop-blur-sm rounded-lg
      shadow-sm border border-lesswrong-border/10">
      <div className="flex items-center justify-between mb-4 px-4 pt-4">
        <h2 className="text-lg font-medium text-lesswrong-text">热门关键词</h2>
        <button
          onClick={refreshKeywords}
          disabled={isRefreshing}
          className="p-2 text-lesswrong-link hover:text-lesswrong-link-hover
            transition-colors duration-200 disabled:opacity-50"
        >
          <svg 
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      </div>
      <div className={`flex flex-wrap gap-2 px-4 pb-4 transition-opacity duration-300
        ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}
      >
        {visibleKeywords.map((keyword, index) => (
          <span
            key={index}
            className="px-2 py-1 text-sm bg-lesswrong-green-light text-lesswrong-link
              rounded-full transition-all duration-200 hover:bg-lesswrong-green-border
              cursor-pointer"
            onClick={() => handleKeywordClick(keyword)}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
} 