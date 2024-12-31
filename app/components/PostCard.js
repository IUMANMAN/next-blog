'use client';

import Link from 'next/link';

export default function PostCard({ title, description, date, id, content }) {
  // 优化预览文本处理
  const getPlainText = (markdown) => {
    if (!markdown) return '';
    return markdown
      // 移除图片
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // 移除链接，保留链接文字
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
      // 移除标题符号
      .replace(/^#+\s+/gm, '')
      // 移除强调符号
      .replace(/[*_`~]/g, '')
      // 移除列表符号
      .replace(/^[-+*]\s+/gm, '')
      // 移除引用符号
      .replace(/^>\s+/gm, '')
      // 移除代码块
      .replace(/```[\s\S]*?```/g, '')
      // 将多个换行替换为一个空格
      .replace(/\n+/g, ' ')
      // 移除多余空格
      .replace(/\s+/g, ' ')
      .trim();
  };

  // 生成预览文本，优先使用 description
  const previewText = description || (content ? getPlainText(content).substring(0, 150) + '...' : '');

  return (
    <article className="group py-8 first:pt-0 last:pb-0">
      <Link 
        href={`/posts/${id}`} 
        className="block group relative p-4 -mx-4 rounded-lg
          transition-all duration-300 ease-out
          hover:bg-white/50 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]
          hover:translate-y-[-2px]"
      >
        <h2 className="text-xl font-medium text-lesswrong-text group-hover:text-lesswrong-link
          transition-colors duration-300">
          {title}
        </h2>
        <div className="mt-2 text-sm text-lesswrong-meta transition-colors duration-300
          group-hover:text-lesswrong-meta/80">
          <time>{date}</time>
        </div>
        {previewText && (
          <p className="mt-3 text-base text-lesswrong-text/90 line-clamp-2 leading-relaxed
            transition-colors duration-300 group-hover:text-lesswrong-text">
            {previewText}
          </p>
        )}
      </Link>
    </article>
  );
} 