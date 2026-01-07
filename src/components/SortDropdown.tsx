"use client";
import { useRouter } from 'next/navigation';

export default function SortDropdown({ order, basePath }: { order: 'asc' | 'desc'; basePath: string }) {
  const router = useRouter();
  return (
    <div className="sortbar">
      <label className="muted mr-2" htmlFor="sort">Sort</label>
      <select
        id="sort"
        className="select"
        defaultValue={order}
        onChange={(e) => {
          const v = e.target.value as 'asc' | 'desc';
          router.push(`${basePath}?sort=${v}`);
        }}
      >
        <option value="desc">Latest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </div>
  );
}

