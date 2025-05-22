import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getPageUrl: (page: number) => string;
}

export function Pagination({ currentPage, totalPages, getPageUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-2 mt-8" aria-label="Pagination">
      {currentPage === 1 ? (
        <span
          aria-disabled="true"
          tabIndex={-1}
          className="px-3 py-1 rounded border bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
        >
          Previous
        </span>
      ) : (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
          aria-label="Previous Page"
        >
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => (
        <Link
          key={i + 1}
          href={getPageUrl(i + 1)}
          aria-current={currentPage === i + 1 ? "page" : undefined}
          className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-red-700 text-white" : "hover:bg-gray-100"}`}
        >
          {i + 1}
        </Link>
      ))}
      {currentPage === totalPages ? (
        <span
          aria-disabled="true"
          tabIndex={-1}
          className="px-3 py-1 rounded border bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
        >
          Next
        </span>
      ) : (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-1 rounded border hover:bg-gray-100"
          aria-label="Next Page"
        >
          Next
        </Link>
      )}
    </nav>
  );
}

export default Pagination;
