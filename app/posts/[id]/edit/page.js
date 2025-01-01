'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PostEditor from '@/app/components/PostEditor';

export default function EditPost({ params }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/api/auth/signin');
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
        setKeywords(data.keywords || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('加载文章失败，请稍后重试');
      }
    };

    fetchPost();
  }, [params.id, status]);

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          keywords,
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '更新失败');
      }

      router.push(`/posts/${params.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('更新失败，请重试');
    } finally {
      setIsSubmitting(false);
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

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {keywords.map((keyword, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-lesswrong-green-light text-lesswrong-link
                  rounded-full flex items-center gap-2 group"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  className="w-4 h-4 rounded-full flex items-center justify-center
                    hover:bg-lesswrong-link/10 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="添加关键词（回车确认）"
              className="flex-1 px-3 py-1.5 border border-lesswrong-border/30 rounded-lg
                bg-transparent focus:border-lesswrong-link/50 focus:outline-none
                transition-colors duration-200"
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-1.5 bg-lesswrong-green-light text-lesswrong-link
                rounded-lg hover:bg-lesswrong-green-border transition-colors duration-200"
            >
              添加
            </button>
          </div>
        </div>

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
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-lesswrong-link rounded-md
              hover:bg-lesswrong-link-hover transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </main>
  );
} 