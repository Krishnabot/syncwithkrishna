export default function Button({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="btn btn-primary">
      {children}
    </a>
  );
}

