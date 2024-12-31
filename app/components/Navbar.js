'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ 
        redirect: false,
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <nav className="bg-lesswrong-nav-bg border-b border-lesswrong-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-medium text-lesswrong-text">
              ManMan Blog
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative hidden sm:block">
              <input
                type="search"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={handleChange}
                className="w-48 md:w-64 pl-10 pr-4 py-2 text-sm bg-transparent border-b border-lesswrong-border
                  focus:outline-none focus:border-lesswrong-meta
                  transition-colors duration-200
                  placeholder-lesswrong-meta"
              />
              <svg 
                className="absolute left-3 top-2.5 h-4 w-4 text-lesswrong-meta"
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
            </div>

            {session?.user && (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/posts/new"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-white bg-lesswrong-link rounded-md
                    hover:bg-lesswrong-link-hover transition-colors duration-200"
                >
                  写文章
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-lesswrong-meta hover:text-lesswrong-text
                    transition-colors duration-200"
                >
                  退出
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 