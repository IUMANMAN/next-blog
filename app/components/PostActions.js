'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PostActions({ post }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // 检查用户是否已登录且是作者 - 使用 username 比较
  const isAuthor = session?.user?.username === post?.author?.username;

  // 如果不是作者，不显示任何内容
  if (!isAuthor) {
    return null;
  }

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
    
    if (!post.id) {
      console.log('No post ID found');
      return;
    }
    
    if (!confirm('确定要删除这篇文章吗？')) {
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Deleting post:', {
        postId: post.id,
        postAuthor: post.author?.username,
        sessionUser: session?.user?.username
      });
      
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.text();
      console.log('Delete response:', {
        status: res.status,
        data: data
      });

      if (!res.ok) {
        throw new Error(
          data ? JSON.parse(data).error : '删除失败'
        );
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

  return (
    <div 
      className="flex items-center gap-4"
      onClick={(e) => e.stopPropagation()} 
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