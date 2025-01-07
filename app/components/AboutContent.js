'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PostEditor from './PostEditor';

export default function AboutContent({ about }) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  // Markdown 组件配置
  const markdownComponents = {
    h1: ({children}) => (
      <h1 className="text-[2rem] sm:text-[3.2rem] font-serif font-bold 
        text-lesswrong-text leading-[1.2] mb-4 sm:mb-6">
        {children}
      </h1>
    ),
    p: ({children}) => (
      <p className="text-[1.1rem] sm:text-[1.3rem] leading-[1.8] sm:leading-[1.9] 
        tracking-[0.01em] text-lesswrong-text/90 my-4 sm:my-6 font-[380]">
        {children}
      </p>
    ),
    // ... 其他 Markdown 组件配置可以从 PostContent 复制
  };

  if (isEditing) {
    return (
      <PostEditor
        initialContent={about.content}
        isAboutPage={true}
        aboutId={about.id}
        onSave={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="relative">
      {session?.user && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-0 right-0 px-4 py-1.5 text-sm font-medium 
            text-lesswrong-text hover:text-lesswrong-link
            transition-colors duration-200"
        >
          编辑
        </button>
      )}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {about.content}
        </ReactMarkdown>
      </div>
    </div>
  );
} 