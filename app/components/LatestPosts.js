'use client';

import Link from 'next/link';

export default function LatestPosts({ posts }) {
  return (
    <aside className="fixed left-[calc(50%-750px)] top-32 w-64 latest-posts-sidebar">
      <h2 className="text-xl font-serif font-bold text-lesswrong-text mb-6">最新文章</h2>
      <div className="space-y-8">
        {posts.map(post => (
          <Link 
            key={post.id}
            href={`/posts/${post.id}`}
            className="group block hover:translate-x-1 transition-transform duration-200"
          >
            <time className="text-sm text-lesswrong-meta block mb-1">
              {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <h3 className="text-base leading-normal text-lesswrong-text/90 
              whitespace-normal break-words line-clamp-2
              group-hover:text-lesswrong-link transition-colors duration-200">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </aside>
  );
} 