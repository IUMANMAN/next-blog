'use client';

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <h2 className="text-2xl font-medium text-lesswrong-text mb-4">
        出现了一些问题
      </h2>
      <p className="text-lesswrong-meta mb-6">
        {error.message || '加载失败，请稍后重试'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-lesswrong-link text-white rounded-lg
          hover:bg-lesswrong-link-hover transition-colors duration-200"
      >
        重试
      </button>
    </div>
  );
} 