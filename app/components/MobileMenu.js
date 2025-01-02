'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function MobileMenu({ posts, keywords }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={toggleMenu}
        className="xl:hidden p-2 text-lesswrong-text hover:text-lesswrong-link
          transition-colors duration-200"
        aria-label="打开菜单"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </button>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[min(80vw,320px)] bg-white shadow-lg
            overflow-y-auto overscroll-contain">
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 
              flex items-center justify-between px-6 py-4 border-b border-lesswrong-border/10">
              <h2 className="text-xl font-bold text-lesswrong-text">
                目录
              </h2>
              <button
                onClick={toggleMenu}
                className="p-2 text-lesswrong-text hover:text-lesswrong-link
                  transition-colors duration-200"
                aria-label="关闭菜单"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-lesswrong-text mb-6 text-center">
                  最新文章
                </h3>
                <div className="space-y-3 flex flex-col items-center">
                  {posts.map(post => (
                    <a
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="block text-sm text-lesswrong-text hover:text-lesswrong-link
                        transition-colors duration-200 text-center max-w-[90%]
                        overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => {
                        toggleMenu();
                        router.push(`/posts/${post.id}`);
                      }}
                    >
                      {post.title}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-lesswrong-text mb-6 text-center
                  ">
                  热门关键词
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-lesswrong-green-light text-lesswrong-link
                        rounded-full transition-all duration-200 hover:bg-lesswrong-green-border
                        cursor-pointer"
                      onClick={() => {
                        toggleMenu();
                        router.push(`/search?q=${encodeURIComponent(keyword)}`);
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 