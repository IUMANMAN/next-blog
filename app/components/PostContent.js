import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { memo } from 'react';

// 缓存 Markdown 组件配置
const markdownComponents = {
  // 覆盖默认的段落渲染
  p: memo(({ node, children, ...props }) => {
    // 检查是否包含图片
    const hasImage = React.Children.toArray(children).some(
      child => React.isValidElement(child) && child.type === 'img'
    );
    
    // 如果包含图片，使用 div 而不是 p
    return hasImage ? (
      <div {...props}>{children}</div>
    ) : (
      <p {...props}>{children}</p>
    );
  }),
  
  // 图片渲染
  img: memo(({ node, ...props }) => (
    <div className="not-prose flex justify-center my-8">
      <img
        {...props}
        className="rounded-lg shadow-md max-h-[500px] object-contain"
        loading="lazy"
      />
    </div>
  )),

  // 代码块渲染
  code: memo(({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }),

  // 链接渲染
  a: memo(({ node, children, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-lesswrong-link hover:text-lesswrong-link-hover 
        transition-colors duration-200"
    >
      {children}
    </a>
  ))
};

const PostContent = memo(function PostContent({ post }) {
  if (!post) return null;

  return (
    <article className="prose prose-lg max-w-none prose-lesswrong">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {post.content}
      </ReactMarkdown>
    </article>
  );
});

export default PostContent; 