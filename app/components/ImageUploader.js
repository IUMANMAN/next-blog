'use client';

import { useState } from 'react';
import ImageGallery from './ImageGallery';

export default function ImageUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [galleryKey, setGalleryKey] = useState(0); // 添加 key 来强制刷新 Gallery

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '上传失败');
      }

      // 上传成功后刷新图片库
      setGalleryKey(prev => prev + 1);
    } catch (error) {
      alert(error.message || '图片上传失败，请重试');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button
            type="button"
            disabled={isUploading}
            className="px-3 py-1 text-sm text-lesswrong-meta hover:text-lesswrong-link 
              border border-lesswrong-border rounded-md transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? '上传中...' : '上传图片'}
          </button>
        </div>
      </div>
      <ImageGallery key={galleryKey} />
    </div>
  );
} 