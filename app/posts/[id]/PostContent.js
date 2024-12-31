'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PostContent({ post, actions }) {
  return (
    <>
      <div className="relative mb-8">
        <div className="absolute top-0 right-0">
          {actions}
        </div>
      </div>
      <div className="markdown-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </>
  );
} 