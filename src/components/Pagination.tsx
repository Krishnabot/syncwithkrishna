import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  query,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | number | undefined>;
}) {
  if (totalPages <= 1) return null;

  const qs = query
    ? Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  const withQs = (href: string) => (qs ? `${href}?${qs}` : href);
  const makeHref = (page: number) => withQs(page === 1 ? basePath : `${basePath}/page/${page}`);
  
  // Calculate page range for better UX
  const getPageRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);
    if (totalPages <= 1) return range;

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }
    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageRange();

  return (
    <nav className="mt-12 flex items-center justify-center" aria-label="Pagination">
      <div className="flex items-center gap-2 bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm rounded-2xl p-2 border border-purple-200/50 dark:border-purple-700/50 shadow-purple-sm">
        {/* Previous button */}
        <Link
          href={makeHref(Math.max(1, currentPage - 1))}
          aria-disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed text-purple-400 dark:text-purple-600'
              : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-900 dark:hover:text-purple-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">Previous</span>
        </Link>

        {/* Page numbers */}
        {pages.map((p, index) => (
          <div key={`${p}-${index}`}>
            {p === '...' ? (
              <span className="px-3 py-2 text-purple-500 dark:text-purple-400 text-sm">...</span>
            ) : (
              <Link
                href={makeHref(p as number)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  p === currentPage
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-purple-md transform scale-105'
                    : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-900 dark:hover:text-purple-100'
                }`}
              >
                {p}
              </Link>
            )}
          </div>
        ))}

        {/* Next button */}
        <Link
          href={makeHref(Math.min(totalPages, currentPage + 1))}
          aria-disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed text-purple-400 dark:text-purple-600'
              : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 hover:text-purple-900 dark:hover:text-purple-100'
          }`}
        >
          <span className="hidden sm:inline text-sm font-medium">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Page info */}
      <div className="ml-6 text-sm text-purple-600 dark:text-purple-400">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
}