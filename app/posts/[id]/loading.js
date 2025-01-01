export default function PostLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      {/* 返回按钮占位 */}
      <div className="mb-6 ml-2">
        <div className="w-16 h-8 bg-gray-200 rounded"></div>
      </div>
      
      {/* 文章标题占位 */}
      <div className="mb-8 text-center">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* 文章内容占位 */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
} 