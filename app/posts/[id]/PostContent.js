'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

// 更新 Markdown 组件样式
const MarkdownComponents = {
  h1: ({children}) => {
    const id = typeof children === 'string' ? children : '';
    return (
      <h1 
        id={id}
        className="text-[2.5rem] font-serif font-bold mt-16 mb-8 text-lesswrong-text leading-[1.3]"
      >
        {children}
      </h1>
    );
  },
  h2: ({children}) => {
    const id = typeof children === 'string' ? children : '';
    return (
      <h2 
        id={id}
        className="text-[2rem] font-serif font-bold mt-12 mb-6 text-lesswrong-text leading-[1.3]"
      >
        {children}
      </h2>
    );
  },
  h3: ({children}) => {
    const id = typeof children === 'string' ? children : '';
    return (
      <h3 
        id={id}
        className="text-[1.5rem] font-serif font-bold mt-10 mb-4 text-lesswrong-text leading-[1.3]"
      >
        {children}
      </h3>
    );
  },
  p: ({children, node}) => {
    // 检查是否只包含图片
    const hasOnlyImage = node?.children?.[0]?.type === 'element' && 
                        node.children[0].tagName === 'img';

    // 如果只包含图片，不添加额外的段落包装
    if (hasOnlyImage) {
      return children;
    }

    // 普通段落
    return (
      <p className="text-[1.3rem] leading-[1.9] tracking-[0.01em] text-lesswrong-text/90 my-6 font-[380]">
        {children}
      </p>
    );
  },
  ul: ({children}) => (
    <ul className="list-disc pl-8 my-6 space-y-3 text-[1.3rem] leading-[1.9] text-lesswrong-text/90">
      {children}
    </ul>
  ),
  ol: ({children}) => (
    <ol className="list-decimal pl-8 my-6 space-y-3 text-[1.3rem] leading-[1.9] text-lesswrong-text/90">
      {children}
    </ol>
  ),
  li: ({children}) => (
    <li className="pl-2 leading-[1.9]">{children}</li>
  ),
  blockquote: ({children}) => (
    <blockquote className="border-l-4 border-lesswrong-link/20 pl-8 my-10 
      text-[1.25rem] leading-[1.8] italic text-lesswrong-text/80 font-serif">
      {children}
    </blockquote>
  ),
  a: ({href, children}) => (
    <a 
      href={href}
      className="text-lesswrong-link hover:text-lesswrong-link-hover 
        underline decoration-lesswrong-link/30 hover:decoration-lesswrong-link/60
        transition-colors duration-200"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  img: ({src, alt}) => (
    <div className="my-10">
      <img 
        src={src} 
        alt={alt} 
        className="rounded-lg shadow-md mx-auto max-w-full h-auto"
      />
    </div>
  ),
  hr: () => (
    <hr className="my-12 border-lesswrong-border" />
  ),
  code: ({children}) => (
    <code className="px-1.5 py-0.5 bg-lesswrong-border/20 rounded text-[0.9em] font-mono">
      {children}
    </code>
  ),
  pre: ({children}) => (
    <pre className="bg-lesswrong-border/10 rounded-lg p-4 my-6 overflow-x-auto">
      {children}
    </pre>
  ),
};

// 提取标题的辅助函数
const extractHeadings = (content) => {
  if (!content) return [];
  const lines = content.split('\n');
  return lines
    .filter(line => /^#{1,3}\s/.test(line))
    .map(line => {
      const level = (line.match(/^#+/) || [''])[0].length;
      const text = line.replace(/^#+\s+/, '').trim();
      return { level, text };
    })
    .filter(({ level }) => level <= 3);
};

export default function PostContent({ post, actions }) {
  const [progress, setProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const contentRef = useRef(null);
  const headings = extractHeadings(post.content);

  // 处理滚动进度
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const totalHeight = contentRef.current.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative" ref={contentRef}>
      {/* 添加导航按钮 */}
      <div className="fixed top-1/2 -translate-y-1/2 left-[calc(50%-600px)] right-[calc(50%-600px)] flex justify-between pointer-events-none">
        <div className="w-24 flex items-center pointer-events-auto">
          {post.navigation?.prev && (
            <Link
              href={`/posts/${post.navigation.prev.id}`}
              className="group p-4 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50
                transition-all duration-200 relative"
              title={post.navigation.prev.title}
            >
              <svg 
                className="w-10 h-10 text-lesswrong-link group-hover:text-lesswrong-link/90
                  transition-colors duration-200"
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
              <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1
                bg-white/90 rounded shadow-lg text-sm whitespace-nowrap max-w-xs truncate
                opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {post.navigation.prev.title}
              </span>
            </Link>
          )}
        </div>

        <div className="w-24 flex items-center justify-end pointer-events-auto">
          {post.navigation?.next && (
            <Link
              href={`/posts/${post.navigation.next.id}`}
              className="group p-4 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50
                transition-all duration-200 relative"
              title={post.navigation.next.title}
            >
              <svg 
                className="w-10 h-10 text-lesswrong-link group-hover:text-lesswrong-link/90
                  transition-colors duration-200"
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
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1
                bg-white/90 rounded shadow-lg text-sm whitespace-nowrap max-w-xs truncate
                opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {post.navigation.next.title}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* 进度条 */}
      <div 
        className="fixed left-8 top-16 bottom-0 w-[2px] bg-transparent group"
        onMouseEnter={() => setShowToc(true)}
        onMouseLeave={() => setShowToc(false)}
      >
        <div className="absolute inset-0 bg-lesswrong-border/10" />
        <div 
          className="absolute top-0 left-0 w-full bg-lesswrong-link/90"
          style={{ height: `${progress}%` }}
        />
        <div 
          className="absolute w-[3px] h-8 bg-lesswrong-link shadow-lg"
          style={{ top: `${progress}%`, left: '-1px' }}
        />

        {/* 目录 */}
        <div className={`absolute left-8 top-4 w-64 bg-white/90 backdrop-blur-sm
          rounded-lg shadow-lg border border-lesswrong-border/10 p-4
          transform transition-all duration-300 origin-left
          ${showToc ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        >
          <nav className="space-y-1">
            {headings.map(({ text, level }, index) => (
              <button
                key={index}
                onClick={() => {
                  const element = document.getElementById(text);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block text-sm text-left w-full hover:text-lesswrong-link
                  ${level === 1 ? 'font-medium' : ''}
                  ${level === 2 ? 'pl-4' : ''}
                  ${level === 3 ? 'pl-8' : ''}`}
              >
                {text}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 文章内容 */}
      <article className="max-w-4xl mx-auto px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-[3.2rem] font-serif font-bold text-lesswrong-text leading-[1.2] mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-base text-lesswrong-meta">
            <span>by</span>
            <span className="text-lesswrong-text font-medium">
              {post.author?.username || 'my0sterick'}
            </span>
            <span>·</span>
            <time>{new Date(post.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}</time>
          </div>
          {post.keywords?.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
              {post.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 text-base bg-lesswrong-green-light text-lesswrong-link
                    rounded-full transition-colors duration-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
          
          {actions && (
            <div className="absolute top-0 right-0">{actions}</div>
          )}
        </header>

        <div className="prose prose-lg max-w-none mx-auto" style={{ maxWidth: '780px' }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
} 