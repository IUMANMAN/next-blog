'use client';

import Link from 'next/link';

export default function Pagination({ currentPage, totalPages }) {
  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="px-4 py-2 text-lesswrong-link hover:text-lesswrong-link-hover
            transition-colors duration-200"
        >
          上一页
        </Link>
      )}
      
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <Link
            key={i}
            href={`/?page=${i + 1}`}
            className={`w-8 h-8 flex items-center justify-center rounded
              transition-colors duration-200
              ${currentPage === i + 1 
                ? 'bg-lesswrong-link text-white' 
                : 'text-lesswrong-text hover:text-lesswrong-link'
              }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>

      {currentPage < totalPages && (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="px-4 py-2 text-lesswrong-link hover:text-lesswrong-link-hover
            transition-colors duration-200"
        >
          下一页
        </Link>
      )}
    </div>
  );
} 