'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import ImageUploader from '@/app/components/ImageUploader';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[500px] border border-lesswrong-border/30 rounded-lg 
        animate-pulse bg-gray-50"
      />
    )
  }
);

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [editorMode, setEditorMode] = useState('live');
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

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
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          content,
          keywords,
        }),
      });

      if (!res.ok) throw new Error('发布失败');
      
      const data = await res.json();
      router.push(`/posts/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">写文章</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="文章标题"
            className="w-full px-4 py-2 rounded-lg border border-lesswrong-border 
              focus:outline-none focus:ring-2 focus:ring-lesswrong-link/50"
          />
        </div>

        

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


        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => setShowImageUploader(!showImageUploader)}
            className="px-4 py-2 text-sm font-medium text-lesswrong-link bg-lesswrong-green-light
              hover:bg-lesswrong-green-border rounded-lg transition-colors duration-200"
          > 
            {showImageUploader ? '关闭图片库' : '打开图片库'}
          </button>
        </div>
        
        {showImageUploader && (
          <div className="mb-4">
            <ImageUploader />
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-end gap-2 mb-2">
            <button
              type="button"
              onClick={() => setEditorMode('edit')}
              className={`px-3 py-1 text-sm rounded ${
                editorMode === 'edit' 
                  ? 'bg-lesswrong-link text-white' 
                  : 'text-lesswrong-meta hover:text-lesswrong-link'
              }`}
            >
              编辑
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('live')}
              className={`px-3 py-1 text-sm rounded ${
                editorMode === 'live'
                  ? 'bg-lesswrong-link text-white'
                  : 'text-lesswrong-meta hover:text-lesswrong-link'
              }`}
            >
              实时预览
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={`px-3 py-1 text-sm rounded ${
                editorMode === 'preview'
                  ? 'bg-lesswrong-link text-white'
                  : 'text-lesswrong-meta hover:text-lesswrong-link'
              }`}
            >
              预览
            </button>
          </div>
          <MDEditor
            value={content}
            onChange={setContent}
            preview={editorMode}
            height={500}
            hideToolbar={editorMode === 'preview'}
            enableScroll={true}
            previewOptions={{
              className: "prose prose-lg max-w-none prose-lesswrong",
            }}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-sm font-medium text-lesswrong-meta
              hover:text-lesswrong-text transition-colors duration-200"
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
            {isSubmitting ? '发布中...' : '发布'}
          </button>
        </div>
      </form>
    </main>
  );
} 