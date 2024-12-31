'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PostActions({ post }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('Client Auth Debug:', {
    status,
    session,
    hasUser: !!session?.user
  });

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        credentials: 'include',
        cache: 'no-store'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '删除失败');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      alert(error.message || '删除失败，请稍后重试');
    }
  };

  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
      <button
        onClick={() => router.push(`/posts/${post.id}/edit`)}
        className="text-sm text-lesswrong-meta hover:text-lesswrong-link transition-colors duration-200"
      >
        编辑
      </button>
      <span className="text-lesswrong-meta">·</span>
      <button
        onClick={handleDelete}
        className="text-sm text-lesswrong-meta hover:text-red-500 transition-colors duration-200"
      >
        删除
      </button>
    </div>
  );
} 