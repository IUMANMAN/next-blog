'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import MobileMenu from './MobileMenu';

export default function Navbar({ isLoggedIn, posts, keywords }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

  // 处理滚动效果
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        // 在顶部时总是显示
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // 向下滚动时隐藏
        setIsVisible(false);
      } else {
        // 向上滚动时显示
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // 处理点击搜索图标
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    }
  };

  // 处理点击外部关闭搜索框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm
      border-b border-lesswrong-border/10 z-40 transform transition-transform duration-200
      ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MobileMenu posts={posts} keywords={keywords} />
          <div className="flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-bold text-lesswrong-text leading-none">
              ManMan Blog
            </Link>
            <span className="mx-4 sm:mx-3 text-lesswrong-meta"></span>
            <Link
              href="/about"
              className="hidden xl:block text-lg text-lesswrong-text hover:text-lesswrong-link 
                transition-colors duration-200 ml-4 leading-none"
            >
              关于我
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center" ref={searchRef}>
            <button
              onClick={toggleSearch}
              className="p-2 text-lesswrong-text hover:text-lesswrong-link 
                transition-colors duration-200"
            >
              <svg 
                className="w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
            <div className={`absolute right-0 top-1/2 -translate-y-1/2
              transition-all duration-300 ease-out origin-right
              ${isSearchOpen ? 'w-[180px] sm:w-64 opacity-100 scale-x-100' : 'w-0 opacity-0 scale-x-0'}`}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-white/80 backdrop-blur-sm
                    border border-lesswrong-border rounded-full
                    focus:outline-none focus:ring-0 focus:border-lesswrong-link
                    transition-colors duration-200
                    appearance-none"
                  style={{ WebkitAppearance: 'none' }}
                />
                <svg 
                  className="absolute left-2.5 top-2 h-4 w-4 text-lesswrong-meta"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </form>
            </div>
          </div>

          {session?.user && (
            <div className="flex items-center ml-2">
              <Link
                href="/posts/new"
                className="px-3 sm:px-4 py-1.5 text-sm font-medium text-white 
                  hover:bg-lesswrong-link/90 rounded-md bg-lesswrong-link
                  transition-colors duration-200 whitespace-nowrap"
              >
                <span className="hidden sm:inline">写文章</span>
                <span className="sm:hidden">写</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm text-lesswrong-meta/90 
                  hover:text-lesswrong-text transition-colors duration-200"
              >
                退出
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 