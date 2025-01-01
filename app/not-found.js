import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <h2 className="text-2xl font-medium text-lesswrong-text mb-4">
        页面不存在
      </h2>
      <p className="text-lesswrong-meta mb-6">
        抱歉，您访问的页面不存在或已被删除
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-lesswrong-link text-white rounded-lg
          hover:bg-lesswrong-link-hover transition-colors duration-200"
      >
        返回首页
      </Link>
    </div>
  );
} 