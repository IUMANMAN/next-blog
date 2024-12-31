'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 4; // 一行显示4张图片

  // 加载已上传的图片
  const loadImages = async () => {
    try {
      const res = await fetch('/api/upload');
      if (!res.ok) throw new Error('加载图片失败');
      const data = await res.json();
      // 按时间倒序排序，最新的图片在前面
      const sortedImages = data.images.sort((a, b) => {
        const timeA = parseInt(a.name.split('-')[0]);
        const timeB = parseInt(b.name.split('-')[0]);
        return timeB - timeA;
      });
      setImages(sortedImages);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  // 删除图片
  const handleDelete = async (imageUrl) => {
    if (!confirm('确定要删除这张图片吗？')) return;

    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl })
      });

      if (!res.ok) throw new Error('删除失败');
      
      setImages(images.filter(img => img.url !== imageUrl));
    } catch (error) {
      alert(error.message || '删除失败');
    }
  };

  useEffect(() => {
    loadImages();
  }, []); // 组件挂载时加载图片

  // 获取当前页的图片
  const currentImages = images.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  // 计算总页数
  const totalPages = Math.ceil(images.length / imagesPerPage);

  // 复制 Markdown 标签到剪贴板
  const copyMarkdown = async (url) => {
    try {
      await navigator.clipboard.writeText(`![image](${url})`);
      // 可以添加一个提示
      alert('已复制到剪贴板');
    } catch (error) {
      console.error('Failed to copy:', error);
      // 如果剪贴板API失败，提供备选方案
      const textarea = document.createElement('textarea');
      textarea.value = `![image](${url})`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('已复制到剪贴板');
    }
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-lesswrong-meta">最近上传的图片</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="text-sm text-lesswrong-meta hover:text-lesswrong-link disabled:opacity-50"
            >
              上一页
            </button>
            <span className="text-sm text-lesswrong-meta">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="text-sm text-lesswrong-meta hover:text-lesswrong-link disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {currentImages.map((image, index) => (
          <div key={image.name} className="relative group">
            <Image
              src={image.url}
              alt=""
              width={200}
              height={200}
              className="object-cover w-full aspect-square rounded"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 
              group-hover:opacity-100 transition-opacity duration-200 bg-black/50">
              <button
                onClick={(e) => {
                  e.preventDefault(); // 阻止默认行为
                  e.stopPropagation(); // 阻止事件冒泡
                  copyMarkdown(image.url);
                }}
                className="px-3 py-1 text-sm text-white bg-lesswrong-link rounded-md 
                  hover:bg-lesswrong-link-hover transition-colors duration-200"
              >
                复制 Markdown
              </button>
              <button
                onClick={() => handleDelete(image.url)}
                className="absolute top-2 right-2 p-1.5 text-white bg-red-500 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 