'use client';

import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import ImageUploader from './ImageUploader';
import { useRouter } from 'next/navigation';

export default function PostEditor({ 
  initialContent = '',
  isAboutPage = false,
  aboutId = null
}) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      let response;
      
      if (isAboutPage) {
        // 更新 About 页面
        response = await fetch('/api/about', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            id: aboutId
          })
        });

        if (!response.ok) {
          throw new Error('保存失败');
        }

        const data = await response.json();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        // 原有的文章保存逻辑
        response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            keywords: keywords.filter(Boolean)
          })
        });

        if (!response.ok) {
          throw new Error('保存失败');
        }

        const data = await response.json();
        router.push(`/posts/${data.id}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 工具栏 */}
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[780px] mx-auto px-4 h-14 flex items-center justify-between">
          {!isAboutPage && (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题..."
              className="flex-1 text-xl font-medium bg-transparent outline-none 
                placeholder:text-gray-400"
            />
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-md
                hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            {isSaved && (
              <span className="text-sm text-green-600">保存成功!</span>
            )}
          </div>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="mt-8">
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={handleContentChange}
            preview="live"
            height={500}
            className="!border-lesswrong-border"
            visibleDragbar={false}
            hideToolbar={false}
            enableScroll={true}
          />
        </div>
        <div className="border-t border-lesswrong-border pt-4">
          <h3 className="text-sm font-medium text-lesswrong-text mb-2">图片管理</h3>
          <ImageUploader />
        </div>
      </div>
    </div>
  );
} 