"use client";
export default function DeleteButton({ slug }: { slug: string }) {
  const onClick = async () => {
    await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
    location.reload();
  };
  return (
    <button className="btn" type="button" onClick={onClick}>Delete</button>
  );
}

