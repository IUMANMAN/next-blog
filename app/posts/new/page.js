'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/app/components/PostEditor';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '发布失败');
      }

      const post = await res.json();
      router.push(`/posts/${post._id}`);
      router.refresh();
    } catch (error) {
      setError(error.message || '发布失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-lesswrong-text">写文章</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="文章标题"
            className="w-full px-4 py-2 text-lg bg-transparent border-b border-lesswrong-border
              focus:outline-none focus:border-lesswrong-link
              transition-colors duration-200
              placeholder-lesswrong-meta"
          />
        </div>

        <PostEditor
          initialContent={content}
          onChange={setContent}
        />

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-lesswrong-meta hover:text-lesswrong-text
              transition-colors duration-200"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 text-sm font-medium text-white bg-lesswrong-link rounded-md
              hover:bg-lesswrong-link-hover transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '发布中...' : '发布'}
          </button>
        </div>
      </form>
    </main>
  );
} 