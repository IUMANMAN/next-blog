'use client';

import { memo } from 'react';
import Link from 'next/link';

const PostNavigation = memo(function PostNavigation({ prevPost, nextPost }) {
  if (!prevPost && !nextPost) return null;

  return (
    <>
      {/* 桌面版 - 固定在两侧 */}
      <div className="hidden lg:block fixed top-1/2 -translate-y-1/2 left-4 right-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <div className="w-64 -translate-x-full">
            {prevPost && (
              <Link
                href={`/posts/${prevPost.id}`}
                className="group flex items-center p-4 bg-white/80 hover:bg-white/95 
                  rounded-lg transition-all duration-200 shadow-sm hover:shadow-md 
                  border border-lesswrong-border/10"
              >
                <svg 
                  className="w-6 h-6 text-lesswrong-link transition-transform 
                    duration-200 group-hover:-translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                <div className="ml-4">
                  <div className="text-sm font-medium text-lesswrong-link mb-1">上一篇</div>
                  <div className="text-base font-medium text-lesswrong-text line-clamp-2">
                    {prevPost.title}
                  </div>
                </div>
              </Link>
            )}
          </div>
          <div className="w-64 translate-x-full">
            {nextPost && (
              <Link
                href={`/posts/${nextPost.id}`}
                className="group flex items-center p-4 bg-white/80 hover:bg-white/95 
                  rounded-lg transition-all duration-200 shadow-sm hover:shadow-md 
                  border border-lesswrong-border/10"
              >
                <div className="mr-4 text-right">
                  <div className="text-sm font-medium text-lesswrong-link mb-1">下一篇</div>
                  <div className="text-base font-medium text-lesswrong-text line-clamp-2">
                    {nextPost.title}
                  </div>
                </div>
                <svg 
                  className="w-6 h-6 text-lesswrong-link transition-transform 
                    duration-200 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 移动版 - 显示在底部 */}
      <div className="lg:hidden mt-6 border-t border-lesswrong-border/10 mb-4">
        <div className="flex justify-between gap-2 mt-4">
          {prevPost && (
            <Link
              href={`/posts/${prevPost.id}`}
              className="group flex items-start p-4 bg-white/80 hover:bg-white/95 
                rounded-lg transition-all duration-200 shadow-sm hover:shadow-md 
                border border-lesswrong-border/10 flex-1"
            >
              <svg 
                className="w-6 h-6 mt-4 text-lesswrong-link flex-shrink-0
                  transition-transform duration-200 group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              <div className="ml-4 min-w-[4rem] text-center">
                <div className="text-sm font-medium text-lesswrong-link mb-1">上一篇</div>
                <div className="text-sm font-medium text-lesswrong-text line-clamp-1">
                  {prevPost.title}
                </div>
              </div>
            </Link>
          )}
          {nextPost && (
            <Link
              href={`/posts/${nextPost.id}`}
              className="group flex items-start justify-end p-4 bg-white/80 hover:bg-white/95 
                rounded-lg transition-all duration-200 shadow-sm hover:shadow-md 
                border border-lesswrong-border/10 flex-1"
            >
              <div className="mr-4 min-w-[4rem] text-center">
                <div className="text-sm font-medium text-lesswrong-link mb-1">下一篇</div>
                <div className="text-sm font-medium text-lesswrong-text line-clamp-1">
                  {nextPost.title}
                </div>
              </div>
              <svg 
                className="w-6 h-6 mt-4 text-lesswrong-link flex-shrink-0
                  transition-transform duration-200 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </>
  );
});

export default PostNavigation; 