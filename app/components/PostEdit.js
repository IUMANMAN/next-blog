export default function PostEdit({ 
  initialContent = '', 
  isAboutPage = false,
  aboutId = null
}) {
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
            content: content,
            id: aboutId
          }),
        });
      } else {
        // 原有的文章保存逻辑
        // ... 保持不变
      }

      if (!response.ok) {
        throw new Error('保存失败');
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Save error:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };
} 