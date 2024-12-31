'use client';

import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import ImageUploader from './ImageUploader';

export default function PostEditor({ initialContent = '', onChange }) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (value) => {
    setContent(value);
    onChange?.(value);
  };

  return (
    <div className="space-y-4">
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
  );
} 