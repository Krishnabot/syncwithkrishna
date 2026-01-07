"use client";
export default function SeedButton() {
  const onClick = async () => {
    const res = await fetch('/api/admin/seed', { method: 'POST' });
    if (res.ok) location.reload();
  };
  return <button className="btn" type="button" onClick={onClick}>Seed Files → DB</button>;
}

