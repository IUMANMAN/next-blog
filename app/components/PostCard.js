'use client';

import Link from 'next/link';

export default function PostCard({ id, title, content, createdAt, keywords, author }) {
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  // 处理内容预览
  const getPreview = (content) => {
    if (!content) return '';

    // 移除所有 Markdown 语法
    const plainText = content
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '')
      .replace(/[#*`~>_-]/g, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return plainText.length > 200 ? plainText.slice(0, 200) + '...' : plainText;
  };

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
            <time>{formatDate(createdAt)}</time>
            <span>·</span>
            <span>{author?.username || 'my0sterick'}</span>
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

        <p className="mt-4 text-lg text-lesswrong-text/90 line-clamp-2 leading-relaxed
          transition-colors duration-200 ease-out
          group-hover:text-lesswrong-text">
          {getPreview(content)}
        </p>
        <div className="absolute inset-0 rounded-lg border border-transparent
          transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          group-hover:border-lesswrong-border/10" 
        />
      </Link>
    </article>
  );
} 