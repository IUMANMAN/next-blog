'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function PostCard({ title, description, date, id, content, keywords }) {
  const { data: session } = useSession();
  
  // 优化预览文本处理
  const getPlainText = (markdown) => {
    if (!markdown) return '';
    return markdown
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
      .replace(/^#+\s+/gm, '')
      .replace(/[*_`~]/g, '')
      .replace(/^[-+*]\s+/gm, '')
      .replace(/^>\s+/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const previewText = description || (content ? getPlainText(content).substring(0, 150) + '...' : '');

  return (
    <article className="py-8 first:pt-0 last:pb-0">
      <Link 
        href={`/posts/${id}`} 
        className="block group relative p-6 -mx-4 rounded-lg
          transform transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          hover:bg-gradient-to-br hover:from-white/90 hover:to-white/50
          hover:shadow-[0_8px_16px_rgb(0,0,0,0.06)]
          hover:scale-[1.005] hover:-translate-y-[2px]"
      >
        <div className="text-center mb-4">
          <h2 className="text-2xl font-medium text-lesswrong-text 
            transition-colors duration-200 ease-out
            group-hover:text-lesswrong-link">
            {title}
          </h2>
          <div className="mt-2 text-base text-lesswrong-meta flex items-center justify-center gap-2
            transition-colors duration-200 group-hover:text-lesswrong-meta/80">
            <time>{date}</time>
            <span>·</span>
            <span>{session?.user?.name || 'Manman'}</span>
          </div>
          {keywords?.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              {keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-sm bg-lesswrong-green-light text-lesswrong-link
                    rounded-full transition-colors duration-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
        {previewText && (
          <p className="mt-4 text-lg text-lesswrong-text/90 line-clamp-2 leading-relaxed
            transition-colors duration-200 ease-out
            group-hover:text-lesswrong-text">
            {previewText}
          </p>
        )}
        <div className="absolute inset-0 rounded-lg border border-transparent
          transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          group-hover:border-lesswrong-border/10" 
        />
      </Link>
    </article>
  );
} 