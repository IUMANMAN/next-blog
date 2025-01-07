'use client';

import { useState } from 'react';

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // 添加新上传的文件到列表
      setUploadedFiles(prev => [
        ...prev,
        ...data.files.map(file => ({
          url: file.url,
          // 确保 URL 是绝对路径
          previewUrl: file.url.startsWith('http') ? file.url : `${window.location.origin}${file.url}`,
          name: file.originalName
        }))
      ]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url, name) => {
    const markdownText = `![${name}](${url})`;
    navigator.clipboard.writeText(markdownText)
      .then(() => {
        alert('Markdown 链接已复制到剪贴板');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('复制失败，请手动复制');
      });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <label className="px-4 py-2 bg-lesswrong-link text-white rounded-md cursor-pointer
          hover:bg-lesswrong-link/90 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          {uploading ? '上传中...' : '选择图片'}
        </label>
        <span className="text-sm text-lesswrong-meta">
          支持 jpg、png、gif 格式
        </span>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={file.previewUrl}
                alt={file.name}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  // 如果预览失败，显示占位图片
                  e.target.src = '/placeholder-image.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-lesswrong-text truncate">{file.name}</p>
                <button
                  onClick={() => copyToClipboard(file.url, file.name)}
                  className="text-sm text-lesswrong-link hover:text-lesswrong-link/90
                    transition-colors mt-1"
                >
                  复制 Markdown
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 