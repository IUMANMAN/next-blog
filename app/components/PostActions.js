'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PostActions({ post }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (post.id) {
      router.push(`/posts/${post.id}/edit`);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!post.id) return;
    
    if (!confirm('确定要删除这篇文章吗？')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || '删除失败');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message || '删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  // 检查用户是否已登录且是作者
  const isAuthor = session?.user?.username === post.author?.username;

  if (!isAuthor) {
    return null;
  }

  return (
    <div 
      className="flex items-center gap-4"
      onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
    >
      <button
        type="button"
        onClick={handleEdit}
        className="px-3 py-1.5 text-sm font-medium text-lesswrong-link 
          hover:text-lesswrong-link-hover transition-colors duration-200
          rounded-md hover:bg-lesswrong-green-light"
      >
        编辑
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1.5 text-sm font-medium text-red-500 
          hover:text-red-600 transition-colors duration-200
          rounded-md hover:bg-red-50 disabled:opacity-50 
          disabled:cursor-not-allowed"
      >
        {isDeleting ? '删除中...' : '删除'}
      </button>
    </div>
  );
} 