'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PostEditor from '@/app/components/PostEditor';

export default function EditPost({ params }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  useEffect(() => {
    if (status === 'loading') return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || '文章加载失败');
        }

        console.log('Fetched post:', data);
        setTitle(data.title || '');
        setContent(data.content || '');
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('加载文章失败，请稍后重试');
      }
    };

    fetchPost();
  }, [params.id, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ title, content })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '更新失败');
      }

      router.push(`/posts/${params.id}`);
      router.refresh();
    } catch (error) {
      setError(error.message || '更新失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-lesswrong-text">编辑文章</h1>
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
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </main>
  );
} 