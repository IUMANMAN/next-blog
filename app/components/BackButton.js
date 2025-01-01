'use client';

import { useRouter } from 'next/navigation';
import { memo } from 'react';

const BackButton = memo(function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-lesswrong-link/80
        hover:text-lesswrong-link transition-all duration-300 ease-out group
        text-lesswrong-link"
      aria-label="返回"
    >
      <svg 
        className="w-5 h-5 transition-all duration-300 ease-out -translate-x-0
          group-hover:-translate-x-1 text-lesswrong-link" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2.5} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      <span className="text-sm font-medium">返回</span>
    </button>
  );
});

export default BackButton; 