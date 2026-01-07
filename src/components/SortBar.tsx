import Link from 'next/link';

export default function SortBar({ order, basePath }: { order: 'asc' | 'desc'; basePath: string }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="muted">Sort:</span>
      <Link href={`${basePath}?sort=desc`} className={`btn btn-icon ${order === 'desc' ? 'bg-blue-600 text-white dark:bg-blue-500' : ''}`}>Latest</Link>
      <Link href={`${basePath}?sort=asc`} className={`btn btn-icon ${order === 'asc' ? 'bg-blue-600 text-white dark:bg-blue-500' : ''}`}>Oldest</Link>
    </div>
  );
}

