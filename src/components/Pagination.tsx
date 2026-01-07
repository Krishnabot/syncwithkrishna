import Link from 'next/link';

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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={makeHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className="btn btn-icon"
      >
        ◀
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={makeHref(p)}
          className={`btn btn-icon ${p === currentPage ? 'bg-blue-600 text-white dark:bg-blue-500' : ''}`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={makeHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className="btn btn-icon"
      >
        ▶
      </Link>
    </nav>
  );
}
