'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  useEffect(() => {
    const searchPosts = async () => {
      try {
        const res = await fetch(`/api/posts?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('搜索失败');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      searchPosts();
    }
  }, [query]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-lesswrong-text mb-8">
        搜索结果: {query}
      </h1>
      <div className="text-sm text-lesswrong-meta mb-4">
        找到 {posts.length} 篇文章
      </div>

      <div className="space-y-8">
        {posts.map(post => (
          <article key={post._id} className="space-y-2">
            <Link 
              href={`/posts/${post._id}`}
              className="text-xl font-medium text-lesswrong-text hover:text-lesswrong-link 
                transition-colors duration-200"
            >
              {post.title}
            </Link>
            <div className="text-sm text-lesswrong-meta">
              {formatDate(post.createdAt)}
            </div>
            <p className="text-lesswrong-text line-clamp-2">
              {post.content.replace(/!\[.*?\]\(.*?\)/g, '').substring(0, 200)}...
            </p>
          </article>
        ))}

        {posts.length === 0 && !isLoading && (
          <div className="text-lesswrong-meta">
            没有找到相关文章
          </div>
        )}
      </div>
    </main>
  );
} 