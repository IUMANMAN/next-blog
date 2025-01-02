'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import BackButton from '@/app/components/BackButton';

const PostEditor = dynamic(() => import('@/app/components/PostEditor'), {
  ssr: false
});

export default function EditPost({ params }) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setPost(data);
        setContent(data.content || '');
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id, status]);

  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title: post.title,
          keywords: post.keywords
        }),
      });

      if (!res.ok) throw new Error('Failed to update post');
      
      router.push(`/posts/${params.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton />
      </div>
      <h1 className="text-3xl font-bold mb-8">{post.title}</h1>
      <PostEditor 
        initialContent={content}
        onChange={setContent}
      />
      <div className="flex items-center justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-lesswrong-meta hover:text-lesswrong-text
            transition-colors duration-200"
        >
          取消
        </button>
        <button
          onClick={handleUpdate}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-lesswrong-link rounded-md
            hover:bg-lesswrong-link-hover transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
      </div>
    </main>
  );
} 