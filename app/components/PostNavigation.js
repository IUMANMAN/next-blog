'use client';

import Link from 'next/link';

export default function PostNavigation({ navigation }) {
  if (!navigation?.prev && !navigation?.next) {
    return null;
  }

  return (
    <nav className="mt-8 pt-8 border-t border-lesswrong-border/10">
      <div className="flex justify-between gap-4">
        {navigation?.prev ? (
          <Link
            href={`/posts/${navigation.prev.id}`}
            className="group flex items-start hover:no-underline flex-1 min-w-0"
          >
            <div className="flex flex-col w-full">
              <span className="text-sm text-lesswrong-meta mb-2 flex items-center group-hover:-translate-x-1 transition-transform duration-200">
                <svg 
                  className="w-5 h-5 mr-1.5 text-lesswrong-meta/70 group-hover:text-lesswrong-link flex-shrink-0" 
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
                <span className="hidden sm:inline">上一篇</span>
              </span>
              <span className="text-base text-lesswrong-text group-hover:text-lesswrong-link transition-colors duration-200 line-clamp-1 break-all">
                {navigation.prev.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {navigation?.next ? (
          <Link
            href={`/posts/${navigation.next.id}`}
            className="group flex items-start justify-end hover:no-underline flex-1 min-w-0"
          >
            <div className="flex flex-col w-full items-end">
              <span className="text-sm text-lesswrong-meta mb-2 flex items-center group-hover:translate-x-1 transition-transform duration-200">
                <span className="hidden sm:inline">下一篇</span>
                <svg 
                  className="w-5 h-5 ml-1.5 text-lesswrong-meta/70 group-hover:text-lesswrong-link flex-shrink-0" 
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
              </span>
              <span className="text-base text-lesswrong-text group-hover:text-lesswrong-link transition-colors duration-200 line-clamp-1 text-right break-all">
                {navigation.next.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
} 